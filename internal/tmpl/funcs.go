// Package tmpl provides various functions for use in Go templates.
package tmpl

import (
	"math"
	"math/rand/v2"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"text/template"
	"time"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

//go:generate go run -v -tags=tools tools/main.go -directive=:tsgen -pkg=$PWD -output=$WORKSPACE/www/src/generated/go-template.gen.ts
var defaultFuncsOnce struct {
	sync.Once
	v template.FuncMap
}

// TemplateFuncs returns the default template functions.
// It is not a global variable so the linker can dead code eliminate
// more when this isn't called (see https://cs.opensource.google/go/go/+/refs/tags/go1.23.0:src/text/template/funcs.go;l=39)
func TemplateFuncs() template.FuncMap {
	defaultFuncsOnce.Do(func() {
		titleCaser := cases.Title(language.English)
		defaultFuncsOnce.v = template.FuncMap{
			// Text.
			"lcFirst":       lowercaseFirstCharacter,
			"ucFirst":       uppercaseFirstCharacter,
			"stripNewLines": stripNewLines,
			"lower":         strings.ToLower,
			"upper":         strings.ToUpper,
			"title":         titleCaser.String,
			"trimSpace":     strings.TrimSpace,
			"replaceAll":    strings.ReplaceAll,
			"contains":      strings.Contains,
			"hasPrefix":     strings.HasPrefix,
			"hasSuffix":     strings.HasSuffix,
			"split":         strings.Split,
			"trimPrefix":    strings.TrimPrefix,
			"trimSuffix":    strings.TrimSuffix,

			// Time.
			"now":  time.Now,
			"date": date,

			// Filepath.
			"dir":          filepath.Dir,
			"base":         filepath.Base,
			"abs":          filepath.Abs,
			"rel":          filepath.Rel,
			"ext":          filepath.Ext,
			"filepathJoin": filepath.Join,

			// Math.
			"add":     add,
			"sub":     sub,
			"mul":     mul,
			"div":     div,
			"mod":     mod,
			"mathAbs": math.Abs,
			"pow":     math.Pow,
			"pow10":   math.Pow10,
			"max":     math.Max,
			"min":     math.Min,
			"ceil":    math.Ceil,
			"floor":   math.Floor,
			"round":   math.Round,
			"sqrt":    math.Sqrt,
			"sin":     math.Sin,
			"cos":     math.Cos,
			"tan":     math.Tan,
			"asin":    math.Asin,
			"acos":    math.Acos,
			"atan":    math.Atan,
			"atan2":   math.Atan2,
			"exp":     math.Exp,
			"log":     math.Log,
			"log10":   math.Log10,
			"log2":    math.Log2,
			"randInt": rand.IntN,

			// Markdown: basic.
			"mdHeading": mdHeading,
			"mdH1":      mdH1,
			"mdH2":      mdH2,
			"mdH3":      mdH3,
			"mdH4":      mdH4,
			"mdH5":      mdH5,
			"mdH6":      mdH6,
			"mdLink":    mdLink,
			"mdBold":    mdBold,
			"mdItalic":  mdItalic,
			"mdQuote":   mdQuote,
			"mdList":    mdList,
			"mdCode":    mdCode,
			"mdHR":      mdHR,
			"mdImage":   mdImage,

			// Markdown: extended.
			"mdTableHeader": mdTableHeader,
			"mdTableRow":    mdTableRow,
			"mdFootnote":    mdFootnote,
			"mdFootnoteRef": mdFootnoteRef,
			"mdStrike":      mdStrike,
			"mdTask":        mdTask,
			"mdTaskChecked": mdTaskChecked,
			"mdEmoji":       mdEmoji,
		}
	})
	return defaultFuncsOnce.v
}

// +-------------------------------+.

// ucFirst converts the first character of s to uppercase.
//
// :tsgen
// :tsgen_name ucFirst
// :tsgen_category Text
func uppercaseFirstCharacter(s string) string {
	if s == "" {
		return ""
	}
	return strings.ToUpper(string(s[0])) + s[1:]
}

// lcFirst converts the first character of s to lowercase.
//
// :tsgen
// :tsgen_name lcFirst
// :tsgen_category Text
func lowercaseFirstCharacter(s string) string {
	if s == "" {
		return ""
	}
	return strings.ToLower(string(s[0])) + s[1:]
}

// stripNewLines removes new lines from s.
// It will replace all sequences of new lines with a single space.
//
// :tsgen
// :tsgen_category Text
func stripNewLines(s string) string {
	fields := strings.FieldsFunc(s, func(r rune) bool {
		return r == '\n'
	})
	return strings.Join(fields, " ")
}

// +-------------------------------+.

// date returns the current date in the format "2006-01-02".
//
// :tsgen
// :tsgen_category Time
func date() string {
	return time.Now().Format("2006-01-02")
}

// +-------------------------------+.

// add returns the sum of nums.
//
// :tsgen
// :tsgen_category Math
func add(nums ...int) int {
	sum := 0
	for _, n := range nums {
		sum += n
	}
	return sum
}

// sub returns the difference of a and b.
//
// :tsgen
// :tsgen_category Math
func sub(a, b int) int { return a - b }

// mul returns the product of a and b.
//
// :tsgen
// :tsgen_category Math
func mul(a, b int) int { return a * b }

// div returns the division of a by b.
//
// :tsgen
// :tsgen_category Math
func div(a, b int) int { return a / b }

// mod returns the remainder of the division of a by b.
//
// :tsgen
// :tsgen_category Math
func mod(a, b int) int { return a % b }

// +-------------------------------+.

// mdHeading returns a markdown heading with the text s at the specified level.
//
// :tsgen
// :tsgen_category Markdown
func mdHeading(s string, level int) string {
	return strings.Repeat("#", level) + " " + s
}

// mdH1 returns a level 1 markdown heading with the text s.
//
// :tsgen
// :tsgen_category Markdown
func mdH1(s string) string {
	return mdHeading(s, 1)
}

// mdH2 returns a level 2 markdown heading with the text s.
//
// :tsgen
// :tsgen_category Markdown
func mdH2(s string) string {
	return mdHeading(s, 2)
}

// mdH3 returns a level 3 markdown heading with the text s.
//
// :tsgen
// :tsgen_category Markdown
func mdH3(s string) string {
	return mdHeading(s, 3)
}

// mdH4 returns a level 4 markdown heading with the text s.
//
// :tsgen
// :tsgen_category Markdown
// :tsgen_returnsdesc The level 4 markdown heading.
func mdH4(s string) string {
	return mdHeading(s, 4)
}

// mdH5 returns a level 5 markdown heading with the text s.
//
// :tsgen
// :tsgen_category Markdown
func mdH5(s string) string {
	return mdHeading(s, 5)
}

// mdH6 returns a level 6 markdown heading with the text s.
//
// :tsgen
// :tsgen_category Markdown
func mdH6(s string) string {
	return mdHeading(s, 6)
}

// mdLink returns a markdown link with the specified title and URL.
//
// :tsgen
// :tsgen_category Markdown
func mdLink(title, url string) string {
	return "[" + title + "](" + url + ")"
}

// mdBold returns s formatted as bold in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdBold(s string) string {
	return "**" + s + "**"
}

// mdItalic returns s formatted as italic in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdItalic(s string) string {
	return "*" + s + "*"
}

// mdQuote returns s formatted as a blockquote in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdQuote(s string) string {
	return "> " + s
}

// mdList returns a markdown list with the specified items.
//
// :tsgen
// :tsgen_category Markdown
func mdList(items ...string) string {
	var sb strings.Builder
	for _, item := range items {
		sb.WriteString("- ")
		sb.WriteString(item)
		sb.WriteString("\n")
	}
	return sb.String()
}

// mdCode returns s formatted as a code block in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdCode(s string) string {
	return "`" + s + "`"
}

// mdHR returns a markdown horizontal rule.
//
// :tsgen
// :tsgen_category Markdown
func mdHR() string {
	return "---"
}

// mdImage returns a markdown image with the specified alt text and URL.
//
// :tsgen
// :tsgen_category Markdown
func mdImage(alt, url string) string {
	return "!" + "[" + alt + "](" + url + ")"
}

// mdTableHeader returns a markdown table header row and separator with the specified headers.
//
// :tsgen
// :tsgen_category Markdown
func mdTableHeader(headers ...string) string {
	var sb strings.Builder
	sb.WriteString("|")
	for _, header := range headers {
		sb.WriteString(" ")
		sb.WriteString(header)
		sb.WriteString(" |")
	}
	sb.WriteString("\n|")
	for range headers {
		sb.WriteString(" -------- |")
	}
	sb.WriteString("\n")
	return sb.String()
}

// mdTableRow returns a markdown table row with the specified cells.
//
// :tsgen
// :tsgen_category Markdown
func mdTableRow(cells ...string) string {
	var sb strings.Builder
	sb.WriteString("| ")
	for _, cell := range cells {
		sb.WriteString(cell)
		sb.WriteString(" | ")
	}
	sb.WriteString("\n")
	return sb.String()
}

// mdFootnote returns a markdown footnote with the specified number n and text s.
//
// :tsgen
// :tsgen_category Markdown
func mdFootnote(n int, s string) string {
	return "[^" + strconv.Itoa(n) + "]: " + s
}

// mdFootnoteRef returns a markdown footnote reference with the specified number n.
//
// :tsgen
// :tsgen_category Markdown
func mdFootnoteRef(n int) string {
	return "[^" + strconv.Itoa(n) + "]"
}

// mdStrike returns s formatted as strikethrough in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdStrike(s string) string {
	return "~~" + s + "~~"
}

// mdTask returns s formatted as an unchecked task list item in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdTask(s string) string {
	return "- [ ] " + s
}

// mdTaskChecked returns s formatted as a checked task list item in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdTaskChecked(s string) string {
	return "- [x] " + s
}

// mdEmoji returns s formatted as an emoji in markdown.
//
// :tsgen
// :tsgen_category Markdown
func mdEmoji(s string) string {
	return ":" + s + ":"
}
