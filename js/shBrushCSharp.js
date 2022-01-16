/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
!function(){function e(){function e(e){var t=0==e[0].indexOf("///")?"color1":"comments";return[new SyntaxHighlighter.Match(e[0],e.index,t)]}var t="abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach get goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed set short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void while";this.regexList=[{regex:SyntaxHighlighter.regexLib.singleLineCComments,func:e},{regex:SyntaxHighlighter.regexLib.multiLineCComments,css:"comments"},{regex:/@"(?:[^"]|"")*"/g,css:"string"},{regex:SyntaxHighlighter.regexLib.doubleQuotedString,css:"string"},{regex:SyntaxHighlighter.regexLib.singleQuotedString,css:"string"},{regex:/^\s*#.*/gm,css:"preprocessor"},{regex:new RegExp(this.getKeywords(t),"gm"),css:"keyword"},{regex:/\bpartial(?=\s+(?:class|interface|struct)\b)/g,css:"keyword"},{regex:/\byield(?=\s+(?:return|break)\b)/g,css:"keyword"}],this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags)}"undefined"!=typeof require&&(SyntaxHighlighter=require("shCore").SyntaxHighlighter),e.prototype=new SyntaxHighlighter.Highlighter,e.aliases=["c#","c-sharp","csharp"],SyntaxHighlighter.brushes.CSharp=e,"undefined"!=typeof exports&&(exports.Brush=e)}();