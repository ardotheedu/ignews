module.exports = {
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
    setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
    // Usamos essa opção para que o jest entenda os arquivos .tsx .jsx .ts .js
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    testEnvironment: "jsdom",
    // Essa opção é para que o jest entendar arquivos de estilização css sass
    moduleNameMapper: {
        "\\.(scss|css|sass)$": "identity-obj-proxy"
    }
};