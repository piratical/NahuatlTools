all: addcr.cpp rmcr.cpp
	g++ -o addcr addcr.cpp
	g++ -o rmcr rmcr.cpp

install: addcr rmcr
	sudo cp addcr /usr/local/bin/. && cp rmcr /usr/local/bin/.

test: addcr rmcr
	./addcr longlines.txt > added && diff added shortlines.txt && rm added && echo "addcr passed the test!"
	./rmcr shortlines.txt > removed && diff removed longlines.txt && rm removed && echo "rmcr passed the test!"

clean:
	rm -f ./addcr ./rmcr added removed

