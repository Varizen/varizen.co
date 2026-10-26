import win32com.client, pythoncom
pythoncom.CoInitialize()
docx = r"c:\Users\ShoebTahseen\Desktop\stfl\weworkhow\STFL_Meeting_Minutes_Template.docx"
word = None
try:
    word = win32com.client.DispatchEx("Word.Application")
    word.Visible = False
    word.DisplayAlerts = 0
    print("Word launched, opening doc...")
    doc = word.Documents.Open(docx, False, False, False)
    print("OPENED OK, paragraphs:", doc.Paragraphs.Count)
    doc.Close(False)
    word.Quit()
    print("DONE")
except Exception as e:
    print("FAIL:", e)
    try:
        if word: word.Quit()
    except Exception:
        pass
