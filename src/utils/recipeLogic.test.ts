import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INGREDIENTS,
  getFilteredSteps,
  formatTimerDisplay,
  calculateProgressPercent,
  calculateRemainingTimeSeconds,
  calculateTotalTimeSeconds,
  formatHumanDuration,
  computeWallClockRemaining,
  getLidReminderState,
  parseVoiceCommand,
  detectClapSpike,
  ACCENT_PRESETS,
  normalizeHexColor,
  resolveGitHubRepoUrl,
} from './recipeLogic';

test('all ingredients and steps use clear English names', () => {
  const cuminMustard = INGREDIENTS.find((i) => i.id === 'jilakara-aavalu')!;
  assert.equal(cuminMustard.name, 'Cumin & Mustard Seeds');

  const turmeric = INGREDIENTS.find((i) => i.id === 'haldi')!;
  assert.equal(turmeric.name, 'Turmeric Powder');

  const corianderPowder = INGREDIENTS.find((i) => i.id === 'dhaniya-powder')!;
  assert.equal(corianderPowder.name, 'Coriander Powder');
});

test('getFilteredSteps includes meat & tomato steps when configured', () => {
  const allSteps = getFilteredSteps({
    mainType: 'meat',
    includeTomato: true,
    customMainName: 'Country Chicken',
  });
  assert.equal(allSteps.length, 23);
  assert.equal(allSteps[0].stepNumber, 1);
  assert.equal(allSteps[allSteps.length - 1].stepNumber, 23);

  const mainStep = allSteps.find((s) => s.id === 'step-main-mix');
  assert.ok(mainStep);
  assert.equal(mainStep.title, 'Add Country Chicken & Mix');

  const defaultSteps = getFilteredSteps({ mainType: 'meat', includeTomato: true });
  for (const step of defaultSteps) {
    assert.ok(
      step.title.length <= 24,
      `Expected concise step title <= 24 chars, got "${step.title}" (${step.title.length})`
    );
  }
});

test('getFilteredSteps omits meat-only and optional tomato steps when disabled', () => {
  const vegNoTomatoSteps = getFilteredSteps({
    mainType: 'veg',
    includeTomato: false,
  });
  assert.equal(vegNoTomatoSteps.length, 21);
  assert.equal(
    vegNoTomatoSteps.some((s) => s.id === 'step-optional-tomato'),
    false
  );
  assert.equal(
    vegNoTomatoSteps.some((s) => s.id === 'step-meat-water-lid'),
    false
  );
});

test('getLidReminderState flags all lid-closing and water-on-lid steps accurately', () => {
  const steps = getFilteredSteps({ mainType: 'meat', includeTomato: true });
  const lidCloseStep = steps.find((s) => s.id === 'step-close-lid-1')!;
  const lidReminder = getLidReminderState(lidCloseStep);
  assert.equal(lidReminder.requiresAlert, true);
  assert.equal(lidReminder.urgency, 'critical');

  const waterLidStep = steps.find((s) => s.id === 'step-water-on-lid')!;
  const waterReminder = getLidReminderState(waterLidStep);
  assert.equal(waterReminder.requiresAlert, true);
  assert.equal(waterReminder.urgency, 'water-on-lid');

  const removeWaterStep = steps.find((s) => s.id === 'step-remove-lid-water')!;
  const removeReminder = getLidReminderState(removeWaterStep);
  assert.equal(removeReminder.requiresAlert, true);
  assert.equal(removeReminder.urgency, 'remove-water');
});

test('formatTimerDisplay and wall-clock calculations are exact', () => {
  assert.equal(formatTimerDisplay(0), '00:00');
  assert.equal(formatTimerDisplay(1), '00:01');
  assert.equal(formatTimerDisplay(60), '01:00');
  assert.equal(formatTimerDisplay(300), '05:00');

  assert.equal(calculateProgressPercent(0, 20), 5);
  assert.equal(calculateProgressPercent(19, 20), 100);

  const meatSteps = getFilteredSteps({ mainType: 'meat', includeTomato: true });
  const totalSecs = calculateTotalTimeSeconds(meatSteps);
  assert.equal(totalSecs, 1 + 60 + 60 + 30 + 30 + 60 + 60 + 120 + 45 + 120 + 60 + 60 + 300);

  assert.equal(formatHumanDuration(0), 'Action');
  assert.equal(formatHumanDuration(60), '1m');
  assert.equal(formatHumanDuration(946), '15m 46s');

  const now = 1_700_000_000_000;
  assert.equal(computeWallClockRemaining(now + 60_000, now), 60);
  assert.equal(computeWallClockRemaining(now - 5000, now), 0);

  const vegSteps = getFilteredSteps({ mainType: 'veg', includeTomato: false });
  const totalFromStart = calculateRemainingTimeSeconds(vegSteps, 0, vegSteps[0].timerSeconds);
  assert.ok(totalFromStart >= 660);
});

test('parseVoiceCommand and detectClapSpike handle hands-free kitchen triggers', () => {
  assert.equal(parseVoiceCommand('next step please'), 'NEXT_STEP');
  assert.equal(parseVoiceCommand('go back'), 'PREV_STEP');
  assert.equal(parseVoiceCommand('start timer now'), 'START_PAUSE_TIMER');
  assert.equal(parseVoiceCommand('read instruction again'), 'READ_ALOUD');
  assert.equal(parseVoiceCommand('check lid status'), 'CHECK_LID');
  assert.equal(parseVoiceCommand('random kitchen noise'), null);

  assert.equal(detectClapSpike(0.18, 0.35, 1000, 2500, 0.28), true);
  assert.equal(detectClapSpike(0.18, 0.35, 2000, 2500, 0.28), false);
});

test('normalizeHexColor validates 3-digit and 6-digit hex codes for Nerd Section', () => {
  assert.ok(ACCENT_PRESETS.length >= 6);
  assert.equal(normalizeHexColor('#ea580c'), '#EA580C');
  assert.equal(normalizeHexColor('10b981'), '#10B981');
  assert.equal(normalizeHexColor('#f0a'), '#FF00AA');
  assert.equal(normalizeHexColor('invalid-hex'), null);
  assert.equal(normalizeHexColor('#12345'), null);
});

test('resolveGitHubRepoUrl detects deployed GitHub repository from env or github.io host', () => {
  assert.equal(
    resolveGitHubRepoUrl(),
    'https://github.com/desi-vibecoder/simple-cooking'
  );
  assert.equal(
    resolveGitHubRepoUrl('https://github.com/desi-vibecoder/simple-cooking/'),
    'https://github.com/desi-vibecoder/simple-cooking'
  );
  assert.equal(
    resolveGitHubRepoUrl('', 'desi-vibecoder.github.io', '/simple-cooking/index.html'),
    'https://github.com/desi-vibecoder/simple-cooking'
  );
});



