{expect} = require "chai"
importer = require "../lib/importer"

describe "importer", ->

  describe "when requesting imports", ->

    context "for zero files", ->
      it "should not produce any import statements", ->
        imports = importer
          numFiles: 0
          output: "~/output.css"
          suffix: "blessed"

        expect(imports).to.equal ""

    context "for one file", ->
      it "should not produce any import statements", ->
        imports = importer
          numFiles: 1
          output: "~/output.css"
          suffix: "blessed"

        expect(imports).to.equal ""

    context "for two files", ->
      it "should produce the correct import statements", ->
        imports = importer
          numFiles: 2
          output: "~/output.css"
          suffix: "blessed"

        expect(imports).to.equal """
          @import("./output-blessed-1.css");
        """

    context "for three files", ->
      it "should produce the correct import statements", ->
        imports = importer
          numFiles: 3
          output: "~/output.css"
          suffix: "blessed"

        expect(imports).to.equal """
          @import("./output-blessed-1.css");
          @import("./output-blessed-2.css");
        """
