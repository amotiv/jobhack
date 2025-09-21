import re
from typing import Dict, List, Tuple
from PyPDF2 import PdfReader
from docx import Document

def extract_text_from_upload(path: str, file_format: str) -> str:
    text = ""
    try:
        if file_format.lower() == "pdf":
            reader = PdfReader(path)
            for p in reader.pages:
                text += p.extract_text() or ""
        elif file_format.lower() in {"docx", "doc"}:
            doc = Document(path)
            text = "\n".join(p.text for p in doc.paragraphs)
        else:
            return ""
    except Exception:
        return ""
    return text

def ats_friendly_heuristics(text: str, file_format: str) -> Tuple[bool, List[str]]:
    issues = []
    if not text.strip():
        issues.append("Text not extractable (scanned image or unsupported PDF).")
    if file_format.lower() == "pdf" and len(re.findall(r"\s{3,}", text)) > 50:
        issues.append("Irregular spacing detected (possible multi-column/table layout).")
    ok = len(issues) == 0
    return ok, issues

def keyword_score(resume_text: str, title: str, keywords: List[str]) -> int:
    rt = resume_text.lower()
    score = 0
    total = max(1, len(keywords) + 2)  # 2 for title weight
    hit = sum(1 for k in keywords if k.lower() in rt)
    score += hit
    # title boost if resume mentions title words
    title_tokens = [t for t in re.split(r"[^a-zA-Z0-9]+", title.lower()) if t]
    title_hits = sum(1 for t in title_tokens if t in rt)
    score += min(2, title_hits)  # cap title bonus at 2
    pct = int(round(100 * score / total))
    return min(100, max(0, pct))
