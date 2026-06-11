import os
import re
from datetime import datetime

markdown_file = "/Users/apple/AI-Powered Interview Preparation Platform/doc/api-design.md"

with open(markdown_file, "r") as f:
    lines = f.readlines()

modules = {}
current_mod_id = None
current_mod_name = None
current_feat = None
current_api = None

# Extracting all APIs and TCs
for line in lines:
    line = line.strip()
    # Match module
    m_mod = re.match(r"# (MOD-\d+) — (.+)", line)
    if m_mod:
        current_mod_id = m_mod.group(1).replace("-", "").upper()
        current_mod_name = m_mod.group(2)
        if current_mod_id not in modules:
            modules[current_mod_id] = {"name": current_mod_name, "features": {}}
        current_feat = None
        current_api = None
        continue
        
    # Match feature
    m_feat = re.match(r"# Feature: (FT-\d+-\d+) — (.+)", line)
    if m_feat and current_mod_id:
        feat_id = m_feat.group(1)
        feat_name = m_feat.group(2).split("(")[0].strip()
        current_feat = feat_name
        if current_feat not in modules[current_mod_id]["features"]:
            modules[current_mod_id]["features"][current_feat] = []
        current_api = None
        continue
        
    # Match API
    m_api = re.match(r"## API: ([A-Z]+) (.+)", line)
    if m_api and current_mod_id and current_feat:
        method = m_api.group(1).lower()
        endpoint = m_api.group(2)
        current_api = {"method": method, "endpoint": endpoint, "tcs": []}
        modules[current_mod_id]["features"][current_feat].append(current_api)
        continue
        
    # Match TC
    if line.startswith("| TC-") and current_api:
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 4:
            tc_id = parts[1]
            desc = parts[2]
            expected = parts[3]
            if tc_id.startswith("TC-"):
                # Clean description from markdown symbols if any
                desc = desc.replace("|", "")
                current_api["tcs"].append({"id": tc_id, "desc": desc, "expected": expected})

total_tests = 0
for mod_id, mod_data in modules.items():
    if not mod_data["features"]:
        # Add default if missing
        mod_data["features"]["Default Feature"] = [
            {"method": "get", "endpoint": "/api/v1/placeholder", "tcs": [
                {"id": f"TC-{mod_id}-001", "desc": "Default GET test", "expected": "200 OK"}
            ]}
        ]
    
    for feat, apis in mod_data["features"].items():
        for api in apis:
            total_tests += len(api["tcs"])

# Also add some dummy global/perf tests as required by the template
total_tests += 4 

md_content = f"""# Test Cases Log — AI-Powered Interview Preparation and Assessment Platform

**Last Updated:** {datetime.utcnow().strftime('%Y-%m-%d')}
**Total Tests:** {total_tests} | **Passing:** 0 | **Failing:** {total_tests} | **Skipped:** 0

---

## Summary Dashboard

| Module | Total | ✅ Pass | ❌ Fail | ⏭ Skip |
| :--- | :---: | :---: | :---: | :---: |
"""

for mod_id, mod_data in modules.items():
    mod_total = 0
    for feat, apis in mod_data["features"].items():
        for api in apis:
            mod_total += len(api["tcs"])
    
    md_content += f"| {mod_id}: {mod_data['name']} | {mod_total} | 0 | {mod_total} | 0 |\n"

md_content += f"| Security & Cross-Cutting | 3 | 0 | 3 | 0 |\n"
md_content += f"| Performance Tests | 1 | 0 | 1 | 0 |\n"
md_content += f"| **TOTAL** | {total_tests} | 0 | {total_tests} | 0 |\n"

for mod_id, mod_data in modules.items():
    md_content += f"\n---\n\n## {mod_id}: {mod_data['name']}\n\n"
    md_content += "| TC ID | Feature | Test Description | Type | Priority | Status | Notes |\n"
    md_content += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
    
    for feat, apis in mod_data["features"].items():
        for api in apis:
            for tc in api["tcs"]:
                # determine type/priority roughly
                tc_type = "Integration"
                priority = "High"
                if "401" in tc["expected"] or "403" in tc["expected"]:
                    tc_type = "Security"
                if "Edge case" in tc["desc"]:
                    priority = "Medium"
                
                md_content += f"| {tc['id']} | {feat} | {tc['desc']} | {tc_type} | {priority} | ❌ FAIL | Pending impl |\n"

md_content += """
---

## Security & Cross-Cutting Tests

| TC ID | Scope | Test Description | Type | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-SEC-001 | Global | SQL injection attempt blocked | Security | Critical | ❌ FAIL | Pending impl |
| TC-SEC-002 | Global | XSS payload sanitized | Security | Critical | ❌ FAIL | Pending impl |
| TC-RATE-001 | Global | Rate limit exceeded returns 429 | Integration | High | ❌ FAIL | Pending impl |

---

## Performance Tests

| TC ID | Scope | Test Description | Target SLA | Priority | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-PERF-001 | Global | P95 latency < 300ms under 1000 users | P95 < 300ms | High | ❌ FAIL | Pending impl |

---

## Change Log
| Date | TC ID | Change | Author |
| :--- | :--- | :--- | :--- |
| """ + datetime.utcnow().strftime('%Y-%m-%d') + """ | ALL | Initial creation — all FAIL | Antigravity |
"""

with open("/Users/apple/AI-Powered Interview Preparation Platform/doc/test-cases-log.md", "w") as out_f:
    out_f.write(md_content)

print(f"Generated test-cases-log.md with {total_tests} tests.")
