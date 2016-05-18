function onLoad() {
	wcInitialize();
	wcPrintLine("====  Welcome to greenlock.co  ====");
	wcPrintCharacter(">");
	wcReadLine(function (e) { alert(e.length.toString()); wcReadLine(function (e) { alert(e.length.toString()); }); });
}