// Repurposed from https://stackoverflow.com/questions/6346766/javascript-enumerator

class ChallengeType {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

export const challengeTypes = {
    WeightLifting: new ChallengeType('WEIGHTLIFTING', 'Weight Lifting'),
    Running: new ChallengeType('RUNNING', 'Running'),
    HIIT: new ChallengeType('HIIT', 'HIIT'),
    Yoga: new ChallengeType('YOGA', 'Yoga'),
    Cycling: new ChallengeType('CYCLING', 'Cycling'),
    Rowing: new ChallengeType('ROWING', 'Rowing'),
    Nutrition: new ChallengeType('NUTRITION', 'Nutrition'),
    Weightloss: new ChallengeType('WEIGHTLOSS', 'Weight Loss')
};
