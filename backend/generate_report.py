import os
import glob
import xml.etree.ElementTree as ET
from datetime import datetime

reports_dir = "target/surefire-reports"
tests = 0
failures = 0
errors = 0
skipped = 0

if os.path.exists(reports_dir):
    for xml_file in glob.glob(os.path.join(reports_dir, "TEST-*.xml")):
        try:
            tree = ET.parse(xml_file)
            root = tree.getroot()
            tests += int(root.attrib.get('tests', 0))
            failures += int(root.attrib.get('failures', 0))
            errors += int(root.attrib.get('errors', 0))
            skipped += int(root.attrib.get('skipped', 0))
        except Exception as e:
            pass

status = "All tests passed successfully" if (failures == 0 and errors == 0) else "Test failures detected"
date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

content = f"""# Test Execution Report

**Date:** {date_str}

**Command:** mvn clean test

## Result
- **Tests run:** {tests}
- **Failures:** {failures}
- **Errors:** {errors}
- **Skipped:** {skipped}

## Status
{status}
"""

out_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "doc", "test-cases-log.md"))
os.makedirs(os.path.dirname(out_path), exist_ok=True)

with open(out_path, "w") as f:
    f.write(content)

print("Successfully updated test-cases-log.md with test execution report.")
