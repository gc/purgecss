import postcss from "./dist/postcss/postcss.mjs";

postcss([])
		.process(".body {color: red}", { from: undefined, to: undefined })
		.then(res => console.log(res.css));