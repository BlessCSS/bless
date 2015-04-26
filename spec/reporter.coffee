{expect} = require "chai"
reporter = require "../lib/reporter"

describe "reporter", ->

  describe "when requesting a report", ->

    context "for 0 selectors in one file", ->
      it "should produce the correct report", ->
        report = reporter
          numFiles: 1
          numSelectors: 0

        expect(report).to.equal "Input file contained 0 selectors. No changes made."

    context "for 1 selector in one file", ->
      it "should produce the correct report", ->
        report = reporter
          numFiles: 1
          numSelectors: 1

        expect(report).to.equal "Input file contained 1 selector. No changes made."

    context "for 4,095 selectors in one file", ->
      it "should produce the correct report", ->
        report = reporter
          numFiles: 1
          numSelectors: 4095

        expect(report).to.equal "Input file contained 4,095 selectors. No changes made."

    context "for 8,190 selectors in two files", ->
      it "should produce the correct report", ->
        report = reporter
          numFiles: 2
          numSelectors: 8190

        expect(report).to.equal "Input file contained 8,190 selectors. 2 files created."

    context "for 12,285 selectors in three files", ->
      it "should produce the correct report", ->
        report = reporter
          numFiles: 3
          numSelectors: 12285

        expect(report).to.equal "Input file contained 12,285 selectors. 3 files created."
