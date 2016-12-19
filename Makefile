.PHONY: test

PROJECT_NAME := $(shell node_modules/.bin/miniquery -p 'name' ./package.json)

test:
	@echo "Testing project ${PROJECT_NAME}" \
	&& ./node_modules/.bin/istanbul cover \
		 ./node_modules/.bin/mocha -- test/specs.js \
  && node_modules/.bin/codecov

major:
	./node_modules/.bin/npm-bump major

minor:
	./node_modules/.bin/npm-bump minor

patch:
	@./node_modules/.bin/npm-bump patch
