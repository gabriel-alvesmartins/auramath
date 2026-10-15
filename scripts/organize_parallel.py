import os
import sys
import time
import json
import shutil
from pathlib import Path
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor, as_completed
from classifier_rules import classify_text

# Global worker engine
worker_ocr = None

def init_worker():
    global worker_ocr
    from rapidocr_onnxruntime import RapidOCR
    worker_ocr = RapidOCR()

def process_file_task(img_path_str):
    global worker_ocr
    img_path = Path(img_path_str)
    try:
        result, _ = worker_ocr(str(img_path))
        if not result:
            return img_path.name, "_Review_and_Outliers", "No_Text_Detected", ""
        text = " ".join([box[1] for box in result])
        macro_cat, sub_flow = classify_text(text)
        return img_path.name, macro_cat, sub_flow, text
    except Exception as e:
        return img_path.name, "_Review_and_Outliers", "Error_Processing", str(e)

def main():
    source_dir = Path("duolingo_screens_imagens")
    target_root = Path("duolingo_screens_organizadas")

    all_source_files = sorted(list(source_dir.glob("*.png")))
    total = len(all_source_files)

    # Check already processed files
    existing_files = set()
    if target_root.exists():
        for p in target_root.rglob("*.png"):
            existing_files.add(p.name)

    print(f"Total files: {total}. Already organized: {len(existing_files)}.")
    
    files_to_process = [f for f in all_source_files if f.name not in existing_files]
    print(f"Remaining to process: {len(files_to_process)} with 6 parallel processes...")

    start_time = time.time()
    num_workers = 6

    category_counts = defaultdict(lambda: defaultdict(int))
    file_records = []
    outliers = []

    # If there are already files, we can scan their placement
    for p in target_root.rglob("*.png"):
        rel_parts = p.relative_to(target_root).parts
        if len(rel_parts) >= 2:
            macro_cat = rel_parts[0]
            sub_flow = rel_parts[1]
            category_counts[macro_cat][sub_flow] += 1
            file_records.append({
                "filename": p.name,
                "macro_category": macro_cat,
                "sub_flow": sub_flow,
                "text_snippet": "(already organized)"
            })
            if macro_cat == "_Review_and_Outliers":
                outliers.append(file_records[-1])

    if files_to_process:
        with ProcessPoolExecutor(max_workers=num_workers, initializer=init_worker) as executor:
            future_to_file = {executor.submit(process_file_task, str(f)): f for f in files_to_process}
            
            done_count = 0
            for future in as_completed(future_to_file):
                done_count += 1
                fname, macro_cat, sub_flow, text = future.result()
                
                dest_dir = target_root / macro_cat / sub_flow
                dest_dir.mkdir(parents=True, exist_ok=True)
                src_file = source_dir / fname
                dest_file = dest_dir / fname
                
                shutil.copy2(src_file, dest_file)
                
                category_counts[macro_cat][sub_flow] += 1
                rec = {
                    "filename": fname,
                    "macro_category": macro_cat,
                    "sub_flow": sub_flow,
                    "text_snippet": (text[:120] + "...") if len(text) > 120 else text
                }
                file_records.append(rec)
                if macro_cat == "_Review_and_Outliers":
                    outliers.append(rec)

                if done_count % 50 == 0 or done_count == len(files_to_process):
                    elapsed = time.time() - start_time
                    speed = done_count / elapsed
                    eta = (len(files_to_process) - done_count) / speed if speed > 0 else 0
                    print(f"[{done_count}/{len(files_to_process)}] ({done_count*100/len(files_to_process):.1f}%) - Speed: {speed:.1f} screens/s - ETA: {eta:.0f}s", flush=True)

    total_time = time.time() - start_time
    print(f"\nAll {total} screens processed successfully! Time: {total_time:.1f}s.")

    # Write report
    report_data = {
        "total_screens": total,
        "categories": {cat: dict(subs) for cat, subs in category_counts.items()},
        "outliers_count": len(outliers),
        "outliers": outliers,
        "files": file_records
    }

    report_path = target_root / "classification_report.json"
    with open(report_path, "w", encoding="utf-8") as rf:
        json.dump(report_data, rf, indent=2, ensure_ascii=False)

    summary_lines = [
        "# Resumo da Organização das Telas do Duolingo\n",
        f"- **Total de telas no dataset:** {total}",
        f"- **Telas organizadas com sucesso:** {total - len(outliers)} ({((total - len(outliers))*100/total):.1f}%)",
        f"- **Telas em revisão/outliers:** {len(outliers)}\n",
        "## Distribuição por Categoria e Fluxo\n",
        "| Macro-Categoria | Sub-Fluxo | Quantidade de Telas |",
        "| :--- | :--- | :--- |"
    ]

    for macro_cat in sorted(category_counts.keys()):
        for sub_flow in sorted(category_counts[macro_cat].keys()):
            count = category_counts[macro_cat][sub_flow]
            summary_lines.append(f"| `{macro_cat}` | `{sub_flow}` | **{count}** |")

    if outliers:
        summary_lines.append("\n## Telas Marcadas para Revisão (_Review_and_Outliers)\n")
        summary_lines.append("| Arquivo | Motivo / Sub-Fluxo | Snippet de Texto Extraído |")
        summary_lines.append("| :--- | :--- | :--- |")
        for o in outliers[:40]:
            snippet = o['text_snippet'].replace('\n', ' ').replace('|', '-')
            summary_lines.append(f"| `{o['filename']}` | `{o['sub_flow']}` | {snippet} |")
        if len(outliers) > 40:
            summary_lines.append(f"\n*... e mais {len(outliers) - 40} telas listadas no relatório JSON completo.*")

    summary_md = "\n".join(summary_lines)
    
    with open(target_root / "ORGANIZATION_SUMMARY.md", "w", encoding="utf-8") as sf:
        sf.write(summary_md)
    with open("ORGANIZATION_SUMMARY.md", "w", encoding="utf-8") as sf_root:
        sf_root.write(summary_md)

    print("ORGANIZATION_SUMMARY.md atualizado com sucesso!")

if __name__ == "__main__":
    main()
