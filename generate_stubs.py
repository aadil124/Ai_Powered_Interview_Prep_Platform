import os
import re

test_dir = "/Users/apple/AI-Powered Interview Preparation Platform/backend/src/test/java/com/interview/platform"
main_dir = "/Users/apple/AI-Powered Interview Preparation Platform/backend/src/main/java/com/interview/platform"

output_text = ""

for root, dirs, files in os.walk(test_dir):
    for file in files:
        if file.endswith("Test.java"):
            file_path = os.path.join(root, file)
            with open(file_path, "r") as f:
                content = f.read()
                
            pkg_match = re.search(r"package\s+(com\.interview\.platform\.[a-z0-9_]+);", content)
            if not pkg_match: continue
            pkg_name = pkg_match.group(1)
            
            ctrl_match = re.search(r"@WebMvcTest\(([A-Za-z0-9_]+Controller)\.class\)", content)
            if not ctrl_match: continue
            ctrl_name = ctrl_match.group(1)
            
            svc_match = re.search(r"@MockBean\s*\n\s*private\s+([A-Za-z0-9_]+Service)\s+", content)
            if not svc_match: continue
            svc_name = svc_match.group(1)
            
            # Module name from package
            mod_name = pkg_name.split(".")[-1]
            base_path = f"/api/v1/{mod_name.replace('mod', '').split('_', 1)[-1].replace('_', '-')}"
            
            # Path to create
            mod_main_dir = os.path.join(main_dir, mod_name)
            os.makedirs(mod_main_dir, exist_ok=True)
            
            # Controller Code
            ctrl_code = f"""package {pkg_name};

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("{base_path}")
public class {ctrl_name} {{
}}
"""
            ctrl_path = os.path.join(mod_main_dir, f"{ctrl_name}.java")
            with open(ctrl_path, "w") as cf:
                cf.write(ctrl_code)
                
            output_text += f"// File: src/main/java/{pkg_name.replace('.', '/')}/{ctrl_name}.java\n{ctrl_code}\n"
            
            # Service Code
            svc_code = f"""package {pkg_name};

import org.springframework.stereotype.Service;

@Service
public class {svc_name} {{
}}
"""
            svc_path = os.path.join(mod_main_dir, f"{svc_name}.java")
            with open(svc_path, "w") as sf:
                sf.write(svc_code)
                
            output_text += f"// File: src/main/java/{pkg_name.replace('.', '/')}/{svc_name}.java\n{svc_code}\n"

with open("/Users/apple/AI-Powered Interview Preparation Platform/scratch_main.txt", "w") as out_f:
    out_f.write(output_text)

print("Generated stubs successfully.")
