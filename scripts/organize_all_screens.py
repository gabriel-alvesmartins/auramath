import os
import sys
import time
import json
import shutil
from pathlib import Path
from collections import defaultdict
from classifier_rules import process_image

def main():
    source_dir = Path("duolingo_screens_imagens")
    target_root = Path("duolingo_screens_organizadas")

    if not source_dir.exists():
        print(f"Error: source directory {source_dir} not found.")
        sys.exit(1)

    all_files = sorted(list(source_dir.glob("*.png")))
    total = len(all_files)
    print(f"Starting organization of {total} files from {source_dir} to {target_root}...")

    # Create target root
    target_root.mkdir(parents=True, exist_ok=True)

    category_counts = defaultdict(lambda: defaultdict(int))
    file_records = []
    outliers = []

    start_time = time.time()

    for idx, f in enumerate(all_files, 1):
        macro_cat, sub_flow, text = process_image(f)
        
        dest_dir = target_root / macro_cat / sub_flow
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_file = dest_dir / f.name

        shutil.copy2(f, dest_file)

        category_counts[macro_cat][sub_flow] += 1
        
        record = {
            "filename": f.name,
            "macro_category": macro_cat,
            "sub_flow": sub_flow,
            "text_snippet": (text[:120] + "...") if len(text) > 120 else text
        }
        file_records.append(record)

        if macro_cat == "_Review_and_Outliers":
            outliers.append(record)

        if idx % 50 == 0 or idx == total:
            elapsed = time.time() - start_time
            speed = idx / elapsed
            eta = (total - idx) / speed if speed > 0 else 0
            print(f"[{idx}/{total}] ({idx*100/total:.1f}%) - Speed: {speed:.1f} screens/s - ETA: {eta:.0f}s")

    total_time = time.time() - start_time
    print(f"\nFinished processing {total} screens in {total_time:.1f}s ({total/total_time:.1f} screens/s).")

    # Generate JSON report
    report_data = {
        "total_screens": total,
        "processed_time_seconds": round(total_time, 2),
        "categories": {cat: dict(subs) for cat, subs in category_counts.items()},
        "outliers_count": len(outliers),
        "outliers": outliers,
        "files": file_records
    }

    report_path = target_root / "classification_report.json"
    with open(report_path, "w", encoding="utf-8") as rf:
        json.dump(report_data, rf, indent=2, ensure_ascii=False)
    print(f"Report saved to: {report_path}")

    # Generate Markdown Summary
    summary_lines = [
        "# Resumo da Organização das Telas do Duolingo\n",
        f"- **Total de telas processadas:** {total}",
        f"- **Tempo total de execução:** {total_time:.1f}s (~{total_time/60:.1f} minutos)",
        f"- **Velocidade média:** {total/total_time:.1f} telas/segundo",
        f"- **Telas classificadas com sucesso:** {total - len(outliers)} ({((total - len(outliers))*100/total):.1f}%)",
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
        for o in outliers[:30]:
            snippet = o['text_snippet'].replace('\n', ' ').replace('|', '-')
            summary_lines.append(f"| `{o['filename']}` | `{o['sub_flow']}` | {snippet} |")
        if len(outliers) > 30:
            summary_lines.append(f"\n*... e mais {len(outliers) - 30} telas listadas no relatório JSON completo.*")

    summary_md = "\n".join(summary_lines)
    
    with open(target_root / "ORGANIZATION_SUMMARY.md", "w", encoding="utf-8") as sf:
        sf.write(summary_md)
    
    with open("ORGANIZATION_SUMMARY.md", "w", encoding="utf-8") as sf_root:
        sf_root.write(summary_md)

    print("ORGANIZATION_SUMMARY.md gerado com sucesso!")

if __name__ == "__main__":
    main()
