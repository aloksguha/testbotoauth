var analyzer = require('../lib/chatanalyzer')


describe("Basic functions of chat analyzer", function() {
    var an = analyzer.chatanalyzer();
    it("should not be null or undefined", function() {
      expect(an).toBeDefined();
      expect(an.setSentense).toBeDefined();
      expect(an.getSentiment).toBeDefined();
      expect(an.getPossibleReply).toBeDefined();
    });

    an.setSentense("Hello");
    console.log(an.getSentiment());
    console.log(an.getPossibleReply());


  });



