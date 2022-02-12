Add and Remove Carriage Returns

Suppose we have a text file containing
paragraphs separated by blank lines between
the paragraphs, just as is the case with this 
README file.

Depending on the original source of our file, there
are basically two formats that we find:

  1. the paragraphs within the file are themselves 
     broken up across several lines, as is the case here. 

  2. Alternatively, each paragraph may consist of a single
     very long line.

Depending on what we want to do with the file, we may prefer
to have the file in one or the other of these two states.

For example, when using an editor such as vim to structure the
file into a web page, it is easier to read the file if the 
paragraphs are spread across several lines.

On the other hand, when submitting the file for machine translation
using a service such as DeepL, the results are much better when
each paragraph or sentance occupies a single line and is not split
across multiple lines.

While you can easily do this kind of thing inside of vim or using
other tools, it is sometimes very nice to have specific command-line
tools that are easy to use in command-line-based workflows, etc.

Hence here we have two tools:

  1. addcr
  2. rmcr

These tools are written in C++. They are simple and should compile easily
with any standards-compliant c++ compiler using the provided Makefile.

