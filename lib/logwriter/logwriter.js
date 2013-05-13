var LogWriter,
    write = function (caller, prefix, message) {
            var line = new Date().toISOString() + prefix + message;
            switch (caller) {
                case 'debug':
                    if (this.logLevel === 'debug') {
                        this.out.write(line);
                    }
                    break;
                case 'info':
                    if (this.logLevel === 'debug' || this.logLevel === 'info') {
                        this.out.write(line);
                    }
                    break;
                case 'warning':
                    if (this.logLevel !== 'error') {
                        this.out.write(line);
                    }
                    break;
                case 'error':
                    this.out.write(line);
                    break;
                default:
                    break;
            }
        };

LogWriter = function (options) {
    this.out = options.out || process.stdout,
    this.logLevel = options.level;
};

LogWriter.prototype = {
    debug: write.bind(this, 'debug', '[Debug]'),
    info: write.bind(this, 'info', '[Info]'),
    warning: write.bind(this, 'warning', '[Warning]'),
    error:  write.bind(this, 'error', '[Error]')
};

module.exports = LogWriter;