class Command {
    static shortKeys = {};

    constructor(argv, argc) {
        this.arguments = [];
        this.options = {};
    }

    setOptions(argv, argc) {
        let i = 0;
        while (i < argc) {
            if (argv[1].startWith('--')) {
                const keyAndValue = argv[1].split('=');
                const optionKey = keyAndValue[0];
                this.options[optionKey] = keyAndValue.length == 2 ? keyAndValue[1] : argv[++i];
            } else if (argv[1].startWith('-')) {
                let optionKey = argv[1].substring(1);
            }
        }
    }
}

module.exports = Command;

