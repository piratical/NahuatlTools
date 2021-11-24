json_intercollator.js

(c) 2021 by Edward H. Trager All Rights Reserved

Suppose we have a JSON file containing dictionary
entries. So the file is basically a big Javascript
array with each entry being an object. And within
each entry-object, there are a set of key-value
pairs. Also, let's assume that the entire JSON
file is pretty-printed, or formatted in such a 
way that each new key begins on a new line.

With this arrangement, a really quick and
dirty way to add a new key-value pair is to pick
some key that we know occurs in every entry, such
as the "def" key that provides the definition.
Then, we can simply insert our new key-value pair
on a new line right after the "def" key.

Why would we want to do this? Suppose that the
definition entries are in Spanish, but that we
now have a new, separate file, that contains
translations into English of just those "def"
definitions. So we want to intercollate our new
key-value pairs as "en":"<definition in English"

That is what this script does ... in an admittedly
very quick and dirty fashion ... but it does well
what it does. So there you go!

