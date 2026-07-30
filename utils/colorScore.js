const colorScore = {

    Black: {
        White: 10,
        Grey: 10,
        Beige: 9,
        Blue: 8,
        Navy: 8,
        Brown: 7
    },

    White: {
        Black: 10,
        Blue: 9,
        Grey: 9,
        Beige: 8,
        Brown: 8
    },

    Blue: {
        White: 10,
        Black: 9,
        Grey: 8,
        Beige: 8,
        Brown: 8
    },

    Grey: {
        Black: 10,
        White: 10,
        Blue: 9,
        Navy: 8
    },

    Brown: {
        Beige: 10,
        White: 9,
        Blue: 8,
        Olive: 9
    },

    Beige: {
        Brown: 10,
        White: 9,
        Black: 9,
        Navy: 8
    }

};


module.exports = colorScore;