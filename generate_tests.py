import os
import re

package_base = "com.interview.platform"
markdown_file = "/Users/apple/AI-Powered Interview Preparation Platform/doc/api-design.md"
output_dir = "/Users/apple/AI-Powered Interview Preparation Platform/backend/src/test/java/com/interview/platform"

with open(markdown_file, "r") as f:
    lines = f.readlines()

modules = {}
current_mod_id = None
current_feat = None
current_api = None

# Extracting all APIs and TCs
for line in lines:
    line = line.strip()
    # Match module
    m_mod = re.match(r"# (MOD-\d+) — (.+)", line)
    if m_mod:
        current_mod_id = m_mod.group(1).replace("-", "").lower()
        mod_name = m_mod.group(2)
        mod_pkg = f"{current_mod_id}_{mod_name.lower().replace(' ', '_').replace('&', '').replace('-', '_').replace('__', '_')}"
        if current_mod_id not in modules:
            modules[current_mod_id] = {"pkg": mod_pkg, "features": {}}
        current_feat = None
        current_api = None
        continue
        
    # Match feature
    m_feat = re.match(r"# Feature: (FT-\d+-\d+) — (.+)", line)
    if m_feat and current_mod_id:
        feat_id = m_feat.group(1)
        feat_name = m_feat.group(2).split("(")[0].strip()
        feat_class_name = re.sub(r'[^a-zA-Z0-9]', '', feat_name.title())
        current_feat = feat_class_name
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
                current_api["tcs"].append({"id": tc_id, "desc": desc, "expected": expected})

# Handle "pattern-ref" modules (04, 05)
for mod_id, mod_data in modules.items():
    if not mod_data["features"]:
        # If no explicit features, create a default one
        feat_class_name = re.sub(r'[^a-zA-Z0-9]', '', mod_data["pkg"].split('_', 1)[1].title())
        mod_data["features"][feat_class_name] = [
            {"method": "get", "endpoint": "/api/v1/placeholder", "tcs": [
                {"id": f"TC-{mod_id.upper()}-001", "desc": "Default GET test", "expected": "200"}
            ]}
        ]

def get_status_method(expected_str):
    expected_str = expected_str.lower()
    if '201' in expected_str: return 'isCreated()'
    if '202' in expected_str: return 'isAccepted()'
    if '200' in expected_str: return 'isOk()'
    if '400' in expected_str: return 'isBadRequest()'
    if '401' in expected_str: return 'isUnauthorized()'
    if '403' in expected_str: return 'isForbidden()'
    if '404' in expected_str: return 'isNotFound()'
    if '409' in expected_str: return 'isConflict()'
    if '413' in expected_str: return 'isPayloadTooLarge()'
    if '423' in expected_str: return 'isLocked()'
    if '429' in expected_str: return 'isTooManyRequests()'
    if '500' in expected_str: return 'isInternalServerError()'
    if '503' in expected_str: return 'isServiceUnavailable()'
    return 'isOk()'

all_output = []

for mod_id, mod_data in modules.items():
    for feat_name, apis in mod_data["features"].items():
        if not apis: continue
        
        pkg_name = f"{package_base}.{mod_data['pkg']}"
        dir_path = os.path.join(output_dir, mod_data['pkg'])
        os.makedirs(dir_path, exist_ok=True)
        
        class_name = f"{feat_name}ControllerTest"
        ctrl_name = f"{feat_name}Controller"
        svc_name = f"{feat_name}Service"
        
        file_path = os.path.join(dir_path, f"{class_name}.java")
        
        java_code = f"""// File: src/test/java/com/interview/platform/{mod_data['pkg']}/{class_name}.java

package {pkg_name};

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

@WebMvcTest({ctrl_name}.class)
class {class_name} {{

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private {svc_name} service;
"""
        for api in apis:
            for tc in api["tcs"]:
                method_name_parts = re.sub(r'[^a-zA-Z0-9 ]', '', tc['desc']).split()
                method_name_base = "".join([p.capitalize() for p in method_name_parts])
                if not method_name_base: method_name_base = "Test"
                method_name = f"when{method_name_base}_{tc['id'].replace('-', '')}"
                
                status_check = get_status_method(tc['expected'])
                
                body_setup = ""
                request_call = f"mockMvc.perform({api['method']}(\"{api['endpoint']}\")"
                if api['method'] in ['post', 'put', 'patch']:
                    body_setup = """
        String requestBody = "{}";
"""
                    request_call += "\n                .contentType(MediaType.APPLICATION_JSON)\n                .content(requestBody))"
                else:
                    request_call += ")"
                    
                java_code += f"""
    @Test
    @DisplayName("{tc['id']}: {tc['desc']}")
    void {method_name}() throws Exception {{{body_setup}
        // NOTE: No mock setup — service is unimplemented; this test will FAIL until implementation
        
        {request_call}
            .andExpect(status().{status_check});
    }}
"""
        java_code += "}\n"
        
        with open(file_path, "w") as out_f:
            out_f.write(java_code)
            
        all_output.append(f"/backend/src/test/java/com/interview/platform/{mod_data['pkg']}/{class_name}.java\n{java_code}")

with open("/Users/apple/AI-Powered Interview Preparation Platform/scratch_tests.txt", "w") as out_f:
    out_f.write("\n\n".join(all_output))

print(f"Generated {len(all_output)} test files.")
