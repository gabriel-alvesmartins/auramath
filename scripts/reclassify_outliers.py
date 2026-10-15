import os
import re
import json
import shutil
from pathlib import Path
from rapidocr_onnxruntime import RapidOCR
from collections import defaultdict

ocr = RapidOCR()

ADDITIONAL_RULES = [
    # Music
    (r"play the note|note [cdefgab]|treble clef|piano keys", "04_Specialized_Subjects", "02_Music_Course"),
    # Math
    (r"add up to|find paths that|elementary math|multiplication|\d+\s*\+\s*\d+", "04_Specialized_Subjects", "01_Math_Course"),
    # Lily Video call
    (r"respond to lily|lily and strangers|calling lily|incoming call", "03_Core_Lessons_and_Learning", "04_Video_Call_Lesson"),
    # Profile & register
    (r"what is your name\?|first name.*last name|sign up with google|sign up with apple", "02_Auth_and_Account", "02_Register_Create_Profile"),
    (r"signing you in|sign in", "02_Auth_and_Account", "01_Login"),
    (r"verify your phone|receive an sms|standard sms", "02_Auth_and_Account", "03_Phone_and_Password"),
    # Onboarding
    (r"ready to start learning|readyto start learning", "01_Onboarding_and_Welcome", "01_Onboarding_Flow"),
    # Achievements & Year in review
    (r"perfect week|stellar student|claim reward|claimreward|share for a reward", "05_Gamification_and_Streaks", "05_Achievements"),
    (r"grand finale|swipe up to see|top \d+% of global learners", "05_Gamification_and_Streaks", "06_Year_in_Review"),
    # Lessons
    (r"exercises left|where do they live|can't speak now|can\'t speak now|\bstart\b|dine at a restaurant|food & shopping", "03_Core_Lessons_and_Learning", "01_Standard_Lesson"),
    # Outliers
    (r"spending bucket|checking account|credit card|mortgage", "_Review_and_Outliers", "Non_Duolingo_or_External"),
]

def reclassify():
    target_root = Path("duolingo_screens_organizadas")
    outliers_dir = target_root / "_Review_and_Outliers"
    
    if not outliers_dir.exists():
        print("No outliers directory.")
        return

    outlier_files = list(outliers_dir.rglob("*.png"))
    print(f"Checking {len(outlier_files)} outliers for re-classification...")

    reclassified_count = 0

    for f in outlier_files:
        try:
            res, _ = ocr(str(f))
            if not res:
                continue
            text = " ".join([b[1] for b in res]).lower()
            
            matched = False
            for pattern, macro, sub in ADDITIONAL_RULES:
                if re.search(pattern, text):
                    dest_dir = target_root / macro / sub
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest_file = dest_dir / f.name
                    shutil.move(str(f), str(dest_file))
                    reclassified_count += 1
                    matched = True
                    break
            
            if not matched:
                # Default generic fallback if duolingo exercise elements exist
                if any(w in text for w in ["french", "spanish", "english", "german", "italian", "japanese", "continue", "next", "start", "quit", "tap", "unit", "section", "lesson"]):
                    dest_dir = target_root / "03_Core_Lessons_and_Learning" / "01_Standard_Lesson"
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(f), str(dest_dir / f.name))
                    reclassified_count += 1
        except Exception as e:
            pass

    print(f"Successfully re-classified {reclassified_count} files from outliers!")

    # Clean empty outlier subdirectories
    for d in outliers_dir.iterdir():
        if d.is_dir() and not any(d.iterdir()):
            d.rmdir()

    # Recalculate summary
    category_counts = defaultdict(lambda: defaultdict(int))
    total_found = 0
    remaining_outliers = 0

    for p in target_root.rglob("*.png"):
        total_found += 1
        parts = p.relative_to(target_root).parts
        if len(parts) >= 2:
            macro = parts[0]
            sub = parts[1]
            category_counts[macro][sub] += 1
            if macro == "_Review_and_Outliers":
                remaining_outliers += 1

    summary_lines = [
        "# Resumo da Organização das Telas do Duolingo\n",
        f"- **Total de telas no dataset:** {total_found}",
        f"- **Telas organizadas com sucesso:** {total_found - remaining_outliers} ({((total_found - remaining_outliers)*100/total_found):.1f}%)",
        f"- **Telas em revisão/outliers:** {remaining_outliers}\n",
        "## Distribuição por Categoria e Fluxo\n",
        "| Macro-Categoria | Sub-Fluxo | Quantidade de Telas |",
        "| :--- | :--- | :--- |"
    ]

    for macro_cat in sorted(category_counts.keys()):
        for sub_flow in sorted(category_counts[macro_cat].keys()):
            count = category_counts[macro_cat][sub_flow]
            summary_lines.append(f"| `{macro_cat}` | `{sub_flow}` | **{count}** |")

    summary_md = "\n".join(summary_lines)
    with open(target_root / "ORGANIZATION_SUMMARY.md", "w", encoding="utf-8") as sf:
        sf.write(summary_md)
    with open("ORGANIZATION_SUMMARY.md", "w", encoding="utf-8") as sf:
        sf.write(summary_md)

    print("ORGANIZATION_SUMMARY.md atualizado com sucesso!")

if __name__ == "__main__":
    reclassify()
