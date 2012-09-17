import os
INDEX = """<!doctype html>
<html>
<title>idex</title>
<style>
body
{
    font-family: "Lucida Sans Unicode", sans-serif;
    font-size: .8em;
}
ul
{
    list-style: none;
    margin: 0;
    padding: 0;
}
li
{
    padding-left: 0;
}
a
{
    text-decoration: none;
}
icon
{
    display: inline-block;
    background-repeat: no-repeat;
    vertical-align: middle;
    width: -o-skin;
    height: -o-skin;
    margin-right: 3px;
}
.directory icon
{
    background-image: -o-skin('Folder');
}
.file icon
{
    background-image: -o-skin('Window Document Icon');
}
</style>
<ul>
"""

ITEM_DIR = """<li class="directory"><a href="./%s/"><icon></icon>%s</a></li>"""
ITEM_FILE = """<li class="file"><a href="./%s"><icon></icon>%s</a></li>"""
DIR_BLACKLISt = [".git"]
FILE_BLACKLISt = ["index.html"]

def create_index():
    for root, dirs, files in os.walk("."):
        with open(os.path.join(root, "index.html"), "wb") as fp:
            fp.write(INDEX)
            fp.write("<ul>")
            for dir_n in dirs:
                if not dir_n in DIR_BLACKLISt:
                    fp.write(ITEM_DIR % (dir_n, dir_n))
            for file_n in files:
                if not file_n in FILE_BLACKLISt and file_n.endswith(".html"):
                    fp.write(ITEM_FILE % (file_n, file_n))
            fp.write("</ul>")

if __name__ == "__main__": create_index()
