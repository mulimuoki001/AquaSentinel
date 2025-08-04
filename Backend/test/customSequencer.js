const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    sort(tests) {
        const order = [
            'auth.register.test.ts',
            'auth.login.test.ts',
            'auth.logout.test.ts',
            'sensor.test.ts',
        ];

        // Sort test files according to the order array
        return tests.sort((a, b) => {
            const indexA = order.findIndex(name => a.path.endsWith(name));
            const indexB = order.findIndex(name => b.path.endsWith(name));
            return indexA - indexB;
        });
    }
}

module.exports = CustomSequencer;
