module.exports = function func(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
    };
};
