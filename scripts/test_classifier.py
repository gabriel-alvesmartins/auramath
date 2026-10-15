import random
import time
from pathlib import Path
from classifier_rules import process_image

source_dir = Path("duolingo_screens_imagens")
all_files = list(source_dir.glob("*.png"))
print(f"Total files available: {len(all_files)}")

# Pick 20 sample files
random.seed(42)
sample_files = random.sample(all_files, 20)

print("\n--- Testing Classifier on 20 Random Samples ---\n")
start_time = time.time()

for f in sample_files:
    macro, sub, text = process_image(f)
    snippet = (text[:60] + "...") if len(text) > 60 else text
    print(f"[{macro} / {sub}]")
    print(f"  File: {f.name}")
    print(f"  Text: {snippet}")
    print()

elapsed = time.time() - start_time
print(f"Processed 20 files in {elapsed:.2f} seconds ({elapsed/20:.2f}s per file)")
