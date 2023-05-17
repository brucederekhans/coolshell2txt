# coolshell2txt

[CoolShell](https://coolshell.cn) 是 [haoel](https://github.com/haoel) 的个人 Blog，此项目用于将发布在 CoolShell 上的文章离线保存到本地。

此项目提供 2 个 JavaScript 文件：runInConsole.js 和 coolshell2txt.user.js。

如果您在浏览 CoolShell 时希望保存某篇文章，可以打开浏览器的开发者工具并切换到 Console 标签页，然后将 runInConsole.js 的内容全部复制到控制台中并运行即可，浏览器会自动弹出保存对话框。之后您也可以再次点击文章标题下方的“save as”字样进行保存。

如果您的浏览器中已经安装了 Tampermonkey 扩展，也可以选择[安装 CoolShell2txt 脚本](https://github.com/brucederekhans/coolshell2txt/raw/master/coolshell2txt.user.js)，之后每当您浏览 CoolShell 上的某篇文章时，都可以点击文章标题下方的“save as”字样保存这篇文章。