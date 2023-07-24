// Super simple modular console logging system
function doPrint(glyph, message) { if (!message) message = ''; return console.log(glyph, message) }

const LoggingSystem = {

    thumbs(message) { return doPrint('👍',message) },

    disc(message) { return doPrint('💽',message) },

    mega(message){ return doPrint('📣',message) },

    ticket(message) { return doPrint('🎫',message) },

    puzzle(message) { return doPrint('🧩',message) },

    radio(message) { return doPrint('📻',message) },

    fire(message) { return doPrint('🔥',message) }
    
}

module.exports = { LOG: LoggingSystem }