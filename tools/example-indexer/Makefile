BUILD_DIR := build

.DEFAULT_GOAL := all
.PHONY := raylib_example_indexer all clean

example_indexer: main.c
	mkdir -p $(BUILD_DIR)
	gcc main.c -o $(BUILD_DIR)/example_indexer -DSTB_C_LEXER_IMPLEMENTATION

$(BUILD_DIR)/raylib:
	mkdir -p $(BUILD_DIR)
	git clone git@github.com:raysan5/raylib.git $(BUILD_DIR)/raylib

run: example_indexer
	./$(BUILD_DIR)/example_indexer $(BUILD_DIR)/raylib/src $(BUILD_DIR)/raylib/examples $(BUILD_DIR)/output.json

all: $(BUILD_DIR)/raylib example_indexer run

clean:
	rm -rf $(BUILD_DIR)
