package tmpl

import "fmt"

// +-------------------------------+.

func Example_uppercaseFirstCharacter() {
	fmt.Println(uppercaseFirstCharacter("hello"))
	fmt.Println(uppercaseFirstCharacter("Hello"))
	fmt.Println(uppercaseFirstCharacter(""))
	// Output:
	// Hello
	// Hello
	//
}

func Example_lowercaseFirstCharacter() {
	fmt.Println(lowercaseFirstCharacter("Hello"))
	fmt.Println(lowercaseFirstCharacter("hello"))
	fmt.Println(lowercaseFirstCharacter(""))
	// Output:
	// hello
	// hello
	//
}

func Example_stripNewLines() {
	fmt.Println(stripNewLines("Hello\n\nWorld"))
	fmt.Println(stripNewLines("Hello World"))
	// Output:
	// Hello World
	// Hello World
}

// +-------------------------------+.

func Example_add() {
	fmt.Println(add(2, 3))
	// Output: 5
}

func Example_sub() {
	fmt.Println(sub(3, 2))
	// Output: 1
}

func Example_mul() {
	fmt.Println(mul(2, 3))
	// Output: 6
}

func Example_div() {
	fmt.Println(div(6, 3))
	// Output: 2
}

func Example_mod() {
	fmt.Println(mod(7, 3))
	// Output: 1
}

// +-------------------------------+.

func Example_mdHeading() {
	fmt.Println(mdHeading("Hello, World!", 1))
	fmt.Println(mdHeading("Hello, World!", 2))
	// Output:
	// # Hello, World!
	// ## Hello, World!
}

func Example_mdH1() {
	fmt.Println(mdH1("Hello, World!"))
	// Output: # Hello, World!
}

func Example_mdH2() {
	fmt.Println(mdH2("Hello, World!"))
	// Output: ## Hello, World!
}

func Example_mdH3() {
	fmt.Println(mdH3("Hello, World!"))
	// Output: ### Hello, World!
}

func Example_mdH4() {
	fmt.Println(mdH4("Hello, World!"))
	// Output: #### Hello, World!
}

func Example_mdH5() {
	fmt.Println(mdH5("Hello, World!"))
	// Output: ##### Hello, World!
}

func Example_mdH6() {
	fmt.Println(mdH6("Hello, World!"))
	// Output: ###### Hello, World!
}

func Example_mdLink() {
	fmt.Println(mdLink("Google", "https://www.google.com"))
	// Output: [Google](https://www.google.com)
}

func Example_mdBold() {
	fmt.Println(mdBold("Hello, World!"))
	// Output: **Hello, World!**
}

func Example_mdItalic() {
	fmt.Println(mdItalic("Hello, World!"))
	// Output: *Hello, World!*
}

func Example_mdQuote() {
	fmt.Println(mdQuote("Hello, World!"))
	// Output: > Hello, World!
}

func Example_mdList() {
	fmt.Println(mdList("First item", "Second item", "Third item"))
	// Output:
	// - First item
	// - Second item
	// - Third item
}

func Example_mdCode() {
	fmt.Println(mdCode("fmt.Println(\"Hello, World!\")"))
	// Output: `fmt.Println("Hello, World!")`
}

func Example_mdHR() {
	fmt.Println(mdHR())
	// Output: ---
}

func Example_mdImage() {
	fmt.Println(mdImage("Gopher", "https://golang.org/doc/gopher/frontpage.png"))
	// Output: ![Gopher](https://golang.org/doc/gopher/frontpage.png)
}

func Example_mdTableHeader() {
	fmt.Println(mdTableHeader("Name", "Age"))
	// Output:
	// | Name | Age |
	// | -------- | -------- |
}

func Example_mdTableRow() {
	fmt.Println(mdTableRow("Alice", "30"))
	// Output: | Alice | 30 |
}

func Example_mdFootnote() {
	fmt.Println(mdFootnote(1, "This is a footnote."))
	// Output: [^1]: This is a footnote.
}

func Example_mdFootnoteRef() {
	fmt.Println(mdFootnoteRef(1))
	// Output: [^1]
}

func Example_mdStrike() {
	fmt.Println(mdStrike("This is a strikethrough."))
	// Output: ~~This is a strikethrough.~~
}

func Example_mdTask() {
	fmt.Println(mdTask("This is a task."))
	// Output: - [ ] This is a task.
}

func Example_mdTaskChecked() {
	fmt.Println(mdTaskChecked("This is a completed task."))
	// Output: - [x] This is a completed task.
}

func Example_mdEmoji() {
	fmt.Println(mdEmoji("smile"))
	// Output: :smile:
}
