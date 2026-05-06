---
title: "Set Default Values for Bash Functions"
description: "Set dynamic values for missing parameters in your bash functions"
pubDate: "Aug 17 2022"
heroImage: "../../assets/blog/set-default-values-for-bash-functions/featured-image.jpg"
---

Sometimes you're working on a bash function that accepts but doesn't necessarily need arguments, so it's useful to provide a default value for them.

You can specify a default value for a variable by using the following syntax:

```bash
${index:-defaultValue}
```

Where:
- `index` is the parameter order (starting with 1 for the first parameter).
- `defaultValue` is the value that the variable will be assigned if not provided.

Here's an example:

```bash
  local name="${1:-Giovanni Benussi}"
```

In the example above I assigned the variable `name` the value of the first parameter or `Giovanni Benussi` if not present.

Here's a function that uses the variable defined in the previous example:

```bash
say_hi() {
  local name="${1:-Giovanni Benussi}"
  echo "Hello $name"
}
```

You can run it and see how it behaves:

```bash
say_hi # Hello Giovanni Benussi
say_hi John # Hello John
```

## Real World Example

I learned about this when creating a [function to get the space usage in disk of some files](/blog/list-the-size-of-every-file-in-a-folder/). I needed a way to allow users to provide a list of files or default to all files in the current directory otherwise.

You can create a variable called `files` with a value corresponding to the first parameter or assign it the result of evaluating `$(ls -A)` if not provided as follows:

```bash
local files="${1:-$(ls -A)}"
```

Then, you can get a human readable summary of the space usage of each file with the `du -hsc` command:

```bash
duu() {
  local files="${1:-$(ls -A)}"
  du -hsc $files
}
```

Setting a default value was really useful because du doesn't include hidden files by default, so passing `ls -A` as a default including hidden files was really useful for my use case.

That's is, [you can reach me out on Twitter](https://twitter.com/giovannibenussi) if you have any question and I'll be glad to help you!
