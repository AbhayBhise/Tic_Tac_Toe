import apiClient from '../utils/apiClient';

export const startSinglePlayerGame = async (difficulty, playerSymbol) => {
    const response = await apiClient.post('/api/game/single/start', {
        difficulty,
        playerSymbol
    });
    return response.data;
};

export const makeSinglePlayerMove = async (matchId, position) => {
    const response = await apiClient.post('/api/game/single/move', {
        matchId,
        position
    });
    return response.data;
};

export const startLocalMultiplayerGame = async (player1Name, player2Name) => {
    const response = await apiClient.post('/api/game/local/start', {
        player1Name,
        player2Name
    });
    return response.data;
};

export const makeLocalMultiplayerMove = async (matchId, position, symbol) => {
    const response = await apiClient.post('/api/game/local/move', {
        matchId,
        position,
        symbol
    });
    return response.data;
};
