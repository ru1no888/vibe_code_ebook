import os
import zipfile

def create_aia_file():
    aia_path = os.path.join(os.path.dirname(__file__), 'VibeEBookShop_Wrapper.aia')
    
    project_properties = """main=appinventor.ai_vibemaster.EBookShop.Screen1
name=EBookShop
assets=../assets
source=../src
build=../build
versioncode=1
versionname=1.0
useslocation=False
aname=VibeStore
theme=AppTheme.Light.DarkActionBar
"""

    screen1_scm = """#$JSON
{
  "YaVersion": "242",
  "Source": "Screen",
  "Properties": {
    "$Type": "Form",
    "$Name": "Screen1",
    "$Version": "31",
    "AppName": "VibeStore",
    "Title": "Vibe Digital Store",
    "Sizing": "Responsive",
    "ShowListsAsJson": "True",
    "Icon": "icon.png",
    "$Components": [
      {
        "$Type": "WebViewer",
        "$Name": "WebViewer1",
        "$Version": "10",
        "HomeUrl": "https://vibe-digital-store.vercel.app",
        "Width": -2,
        "Height": -2,
        "FollowLinks": true,
        "IgnoreSslErrors": false,
        "UsesLocation": false
      }
    ]
  }
}
"""

    screen1_bky = """<xml xmlns="http://www.w3.org/1999/xhtml">
  <block type="component_event" id="1" x="50" y="50">
    <mutation component_type="Form" is_generic="false" instance_name="Screen1" event_name="BackPressed"></mutation>
    <field name="COMPONENT_SELECTOR">Screen1</field>
    <statement name="DO">
      <block type="controls_if" id="2">
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
</xml>
"""

    icon_source = os.path.join(os.path.dirname(__file__), '..', 'public', 'icon.png')
    
    with zipfile.ZipFile(aia_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.writestr('youngandroidproject/project.properties', project_properties)
        zipf.writestr('src/appinventor/ai_vibemaster/EBookShop/Screen1.scm', screen1_scm)
        zipf.writestr('src/appinventor/ai_vibemaster/EBookShop/Screen1.bky', screen1_bky)
        if os.path.exists(icon_source):
            zipf.write(icon_source, 'assets/icon.png')
            
    print(f"Successfully generated MIT App Inventor project: {aia_path}")

if __name__ == '__main__':
    create_aia_file()
