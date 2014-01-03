define( [
    './extendHooks/plusMinusExtendHook',
    './extendHooks/accessorsExtendHook',
    './extendHooks/typeExtendHook',
 ], function( plusMinusExtendHook, accessorsExtendHook, typeExtendHook ) {


    return [ accessorsExtendHook, typeExtendHook, plusMinusExtendHook ]


} )