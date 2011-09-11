var vows = require('vows'),
    assert = require('assert'),
    AssetGraph = require('assetgraph'),
    transforms = require('../lib/transforms'),
    query = AssetGraph.query;

vows.describe('one.getText').addBatch({
    'After loading test case': {
        topic: function () {
            new AssetGraph({root: __dirname + '/JavaScriptOneGetText/'}).queue(
                transforms.loadAssets('index.html.template'),
                transforms.populate(),
                transforms.injectOneBootstrapper({isInitial: true})
            ).run(this.callback);
        },
        'the graph should contain 4 assets': function (assetGraph) {
            assert.equal(assetGraph.findAssets().length, 4);
        },
        'the graph should contain one JavaScriptOneGetText relation': function (assetGraph) {
            assert.equal(assetGraph.findRelations({type: 'JavaScriptOneGetText'}).length, 1);
        },
        'then inline and remove the JavaScriptOneGetText relations': {
            topic: function (assetGraph) {
                assetGraph.queue(
                    transforms.inlineRelations({type: 'JavaScriptOneGetText'}),
                    transforms.removeRelations({type: 'JavaScriptOneGetText'}, {removeOrphan: true})
                ).run(this.callback);
            },
            'the graph should be down to 3 assets': function (assetGraph) {
                assert.equal(assetGraph.findAssets().length, 3);
            },
            'then get the JavaScript asset as text': {
                topic: function (assetGraph) {
                    return assetGraph.findAssets({type: 'JavaScript'})[0].text;
                },
                'the contents of name.txt should have replaced the one.getText expression': function (text) {
                    assert.isTrue(/\"Hello, my name is \"\s*\+\s*\"Foobar/.test(text));
                }
            }
        }
    }
})['export'](module);
