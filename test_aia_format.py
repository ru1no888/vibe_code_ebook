import os
import zipfile
import json

def test_and_build():
    aia_path = os.path.join(os.path.dirname(__file__), 'mobile_app', 'VibeEBookShop_Wrapper.aia')
    
    # Authentic MIT App Inventor project.properties
    project_properties = """main=appinventor.ai_vibemaster.vibe_code_ebook.Screen1
name=vibe_code_ebook
assets=../assets
source=../src
build=../build
versioncode=1
versionname=1.0
useslocation=False
aname=VibeStore
theme=AppTheme.Light.DarkActionBar
sizing=Responsive
showlistsasjson=True
"""

    # Authentic MIT App Inventor SCM format (MUST HAVE #|\n$JSON\n and \n|#\n)
    form_json = {
        "YaVersion": "242",
        "Source": "Form",
        "Properties": {
            "$Name": "Screen1",
            "$Type": "Form",
            "$Version": "32",
            "AppName": "VibeStore",
            "Title": "Vibe Digital Store",
            "Sizing": "Responsive",
            "ShowListsAsJson": "True",
            "Icon": "icon.png",
            "$Components": [
                {
                    "$Name": "WebViewer1",
                    "$Type": "WebViewer",
                    "$Version": "11",
                    "HomeUrl": "https://vibe-digital-store.vercel.app",
                    "Width": -2,
                    "Height": -2,
                    "FollowLinks": True,
                    "IgnoreSslErrors": False,
                    "UsesLocation": False
                }
            ]
        }
    }

    screen1_scm = f"#|\n$JSON\n{json.dumps(form_json)}\n|#\n"

    # Verify parser logic matches FormPropertiesAnalyzer.java
    FORM_PROPERTIES_PREFIX = "#|\n"
    FORM_PROPERTIES_SUFFIX = "\n|#"
    jsonSectionPrefix = FORM_PROPERTIES_PREFIX + "$JSON\n"
    source = screen1_scm.replace("\r\n", "\n")
    beg = source.rfind(jsonSectionPrefix)
    assert beg != -1, "FAIL: Cannot locate beginning of $JSON section"
    end = source.rfind(FORM_PROPERTIES_SUFFIX)
    assert end != -1, "FAIL: Cannot locate end of $JSON section"
    extracted = json.loads(source[beg + len(jsonSectionPrefix):end])
    assert extracted["Properties"]["$Name"] == "Screen1", "FAIL: Form name mismatch"
    print("Verification against FormPropertiesAnalyzer.java: 100% PASSED!")

    # Blockly XML for Screen1.BackPressed
    screen1_bky = """<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="component_event" id="1" x="40" y="40">
    <mutation component_type="Form" is_generic="false" instance_name="Screen1" event_name="BackPressed"></mutation>
    <field name="COMPONENT_SELECTOR">Screen1</field>
    <statement name="DO">
      <block type="controls_if" id="2">
        <mutation else="1"></mutation>
        <value name="IF0">
          <block type="component_method" id="3">
            <mutation component_type="WebViewer" method_name="CanGoBack" is_generic="false" instance_name="WebViewer1"></mutation>
            <field name="COMPONENT_SELECTOR">WebViewer1</field>
          </block>
        </value>
        <statement name="DO0">
          <block type="component_method" id="4">
            <mutation component_type="WebViewer" method_name="GoBack" is_generic="false" instance_name="WebViewer1"></mutation>
            <field name="COMPONENT_SELECTOR">WebViewer1</field>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="component_method" id="5">
            <mutation component_type="Form" method_name="closeApplication" is_generic="false" instance_name="Screen1"></mutation>
            <field name="COMPONENT_SELECTOR">Screen1</field>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>"""

    icon_source = os.path.join(os.path.dirname(__file__), 'public', 'icon.png')
    
    with zipfile.ZipFile(aia_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr('youngandroidproject/project.properties', project_properties)
        zipf.writestr('src/appinventor/ai_vibemaster/vibe_code_ebook/Screen1.scm', screen1_scm)
        zipf.writestr('src/appinventor/ai_vibemaster/vibe_code_ebook/Screen1.bky', screen1_bky)
        if os.path.exists(icon_source):
            zipf.write(icon_source, 'assets/icon.png')
            
    print(f"Generated new AIA: {aia_path}")

    # Copy to MIT_App_Inventor_Submission folder
    dest_dir = os.path.join(os.path.dirname(__file__), '..', 'MIT_App_Inventor_Submission')
    os.makedirs(dest_dir, exist_ok=True)
    import shutil
    shutil.copy2(aia_path, os.path.join(dest_dir, 'VibeEBookShop_Wrapper.aia'))
    print(f"Copied to submission folder: {dest_dir}")

if __name__ == '__main__':
    test_and_build()
