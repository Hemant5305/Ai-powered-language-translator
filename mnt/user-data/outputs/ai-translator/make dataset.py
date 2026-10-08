"""Convert a 2-column file (english<TAB>hindi, one pair per line) into datasets/en-hi.json
Usage: python make_dataset.py pairs.tsv hi datasets/en-hi.json
Single English words go into "words", longer lines into "phrases"."""
import sys, json, re

src, target, out = sys.argv[1], sys.argv[2], sys.argv[3]
MAX_ENTRIES = 100000  # keep the file browser-friendly

def norm(t):
    return re.sub(r"[!?.,।]+$", "", re.sub(r"\s+", " ", t.strip().lower()))

phrases, words = {}, {}
with open(src, encoding="utf-8") as f:
    for line in f:
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 2 or not parts[0].strip() or not parts[1].strip():
            continue
        en, tr = norm(parts[0]), parts[1].strip()
        (words if " " not in en else phrases).setdefault(en, tr)
        if len(phrases) + len(words) >= MAX_ENTRIES:
            break

with open(out, "w", encoding="utf-8") as f:
    json.dump({"target": target, "phrases": phrases, "words": words}, f, ensure_ascii=False)
print(f"{len(phrases)} phrases, {len(words)} words -> {out}")