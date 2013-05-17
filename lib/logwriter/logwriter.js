var LogWriter = function (options) {
        this.out      = options.out || process.stdout,
        this.logLevel = options.level;
    };
LogWriter.prototype.write = function (caller, prefix, message) {
    var line = [new Date().toISOString(), prefix, message].join(' ');
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
LogWriter.prototype.debug   = function (message) {
    this.write('debug', '[Debug]', message);
};
LogWriter.prototype.info    = function (message) {
    this.write('info', '[Info]', message);
};
LogWriter.prototype.warning = function (message) {
    this.write('warning', '[Warning]', message);
};
LogWriter.prototype.error   = function (message) {
    this.write('error', '[Error]', message);
};


module.exports = LogWriter;