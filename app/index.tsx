import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Link, Stack } from 'expo-router';
import {
  Activity,
  BicepsFlexed,
  Check,
  ChevronDown,
  MoonStarIcon,
  Settings,
  StarIcon,
  SunIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Image, type ImageStyle, View, ScrollView } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartColumnDecreasing } from 'lucide-react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  light: {
    title: 'Macro Manager',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
    headerRight: () => <ThemeToggle />,
  },
  dark: {
    title: 'Macro Manager',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerRight: () => <ThemeToggle />,
  },
};

type UnitSystem = 'metric' | 'imperial' | undefined;
type Sex = 'male' | 'female' | undefined;
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | undefined;
type FitnessGoal = 'lose_weight' | 'maintain_weight' | 'gain_muscle' | undefined;

type NutritionPlan = {
  tdee: number;
  protein: number;
  fat: number;
  carbs: number;
};

export default function Screen() {
  const { colorScheme } = useColorScheme();

  const [sex, setSex] = useState<Sex>(undefined);
  const [unit, setUnit] = useState<UnitSystem>(undefined);
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(undefined);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(undefined);

  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset the calculation whenever a key input changes
  useEffect(() => {
    setNutritionPlan(null);
    setErrorMessage(null);
  }, [sex, unit, age, height, weight, activityLevel, fitnessGoal]);

  function handleAgeChange(input: string) {
    const isValid = /^\d*$/.test(input);
    if (isValid) {
      setAge(input);
    }
  }

  function handleHeightChange(input: string) {
    const isValid = /^\d*$/.test(input);
    if (isValid) {
      setHeight(input);
    }
  }

  function handleWeightChange(input: string) {
    const isValid = /^\d*\.?\d*$/.test(input);
    if (isValid) {
      setWeight(input);
    }
  }

  function calculateNutritionPlan() {
    // Check for missing fields
    if (
      !sex ||
      !unit ||
      age === '' ||
      height === '' ||
      weight === '' ||
      !activityLevel ||
      !fitnessGoal
    ) {
      setErrorMessage('Please fill out all fields to calculate your macros.');
      setNutritionPlan(null);
      return;
    }
    setNutritionPlan(null);

    // Parse inputs and handle unit conversion
    const parsedAge = parseInt(age);
    const parsedHeight = parseInt(height);
    const parsedWeight = parseInt(weight);

    let convertedWeight = parsedWeight;
    let convertedHeight = parsedHeight;

    if (unit === 'imperial') {
      convertedWeight = parsedWeight * 0.453592; // lbs to kg
      convertedHeight = parsedHeight * 2.54; // inches to cm
    }

    // Calculate BMR using the Mifflin-St Jeor equation
    let bmr = 0;
    if (sex === 'male') {
      bmr = 10 * convertedWeight + 6.25 * convertedHeight - 5 * parsedAge + 5;
    } else {
      bmr = 10 * convertedWeight + 6.25 * convertedHeight - 5 * parsedAge - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const activityMultiplier = activityMultipliers[activityLevel];

    // Calculate TDEE
    let tdee = bmr * activityMultiplier;

    // Adjust for fitness goal
    if (fitnessGoal === 'lose_weight') {
      tdee -= 500;
    } else if (fitnessGoal === 'gain_muscle') {
      tdee += 300;
    }

    // Ensure TDEE is not less than a safe minimum
    if (tdee < 1200) {
      tdee = 1200;
    }

    // Calculate macronutrients based on recommendations
    const proteinGrams = convertedWeight * 2.2;
    const proteinCalories = proteinGrams * 4;

    const fatCalories = tdee * 0.25;
    const fatGrams = fatCalories / 9;

    const remainingCalories = tdee - proteinCalories - fatCalories;
    const carbGrams = remainingCalories / 4;

    // Set the state with the calculated values
    setNutritionPlan({
      tdee: Math.round(tdee),
      protein: Math.round(proteinGrams),
      fat: Math.round(fatGrams),
      carbs: Math.round(carbGrams),
    });
  }

  // Define macro distribution percentages for the bar chart
  const macroDistribution = {
    protein: 40,
    carbs: 30,
    fat: 30,
  };

  const isFormComplete =
    !!sex &&
    !!unit &&
    age !== '' &&
    height !== '' &&
    weight !== '' &&
    !!activityLevel &&
    !!fitnessGoal;

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <ScrollView>
        <View className="flex flex-col gap-4 p-4">
          {/* Unit System Card */}
          <Card>
            <CardHeader>
              <CardTitle>Unit System</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex flex-row gap-4">
                <Button
                  className="grow"
                  variant={unit === 'metric' ? 'default' : 'secondary'}
                  onPress={() => setUnit('metric')}>
                  <Text>Metric (kg/cm)</Text>
                </Button>
                <Button
                  className="grow"
                  variant={unit === 'imperial' ? 'default' : 'secondary'}
                  onPress={() => setUnit('imperial')}>
                  <Text>Imperial (lbs/in)</Text>
                </Button>
              </View>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex gap-4">
                <View className="flex flex-row gap-4">
                  <Button
                    className="grow"
                    variant={sex === 'male' ? 'default' : 'secondary'}
                    onPress={() => setSex('male')}>
                    <Text>Male</Text>
                  </Button>
                  <Button
                    className="grow"
                    variant={sex === 'female' ? 'default' : 'secondary'}
                    onPress={() => setSex('female')}>
                    <Text>Female</Text>
                  </Button>
                </View>
                <View>
                  <Label htmlFor="user-age">Age</Label>
                  <Input
                    id="user-age"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={handleAgeChange}
                  />
                </View>
                <View className="flex flex-row gap-4">
                  <View className="flex-1">
                    <Label htmlFor="user-height">Height ({unit === 'metric' ? 'cm' : 'in'})</Label>
                    <Input
                      id="user-height"
                      keyboardType="numeric"
                      value={height}
                      onChangeText={handleHeightChange}
                    />
                  </View>
                  <View className="flex-1">
                    <Label htmlFor="user-weight">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Label>
                    <Input
                      id="user-weight"
                      keyboardType="numeric"
                      value={weight}
                      onChangeText={handleWeightChange}
                    />
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Activity Level Card */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Level</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button
                variant={activityLevel === 'sedentary' ? 'default' : 'secondary'}
                onPress={() => setActivityLevel('sedentary')}>
                <Text>Sedentary (little or no exercise)</Text>
              </Button>
              <Button
                variant={activityLevel === 'light' ? 'default' : 'secondary'}
                onPress={() => setActivityLevel('light')}>
                <Text>Light (exercise 1-3 days/week)</Text>
              </Button>
              <Button
                variant={activityLevel === 'moderate' ? 'default' : 'secondary'}
                onPress={() => setActivityLevel('moderate')}>
                <Text>Moderate (exercise 3-5 days/week)</Text>
              </Button>
              <Button
                variant={activityLevel === 'active' ? 'default' : 'secondary'}
                onPress={() => setActivityLevel('active')}>
                <Text>Active (exercise 6-7 days/week)</Text>
              </Button>
              <Button
                variant={activityLevel === 'very_active' ? 'default' : 'secondary'}
                onPress={() => setActivityLevel('very_active')}>
                <Text>Very Active (hard exercise daily)</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Fitness Goal Card */}
          <Card>
            <CardHeader>
              <CardTitle>Fitness Goal</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button
                variant={fitnessGoal === 'lose_weight' ? 'default' : 'secondary'}
                onPress={() => setFitnessGoal('lose_weight')}>
                <Icon
                  as={ChartColumnDecreasing}
                  className={
                    fitnessGoal === 'lose_weight'
                      ? 'text-primary-foreground'
                      : 'text-secondary-foreground'
                  }
                />
                <Text>Lose Weight</Text>
              </Button>
              <Button
                variant={fitnessGoal === 'maintain_weight' ? 'default' : 'secondary'}
                onPress={() => setFitnessGoal('maintain_weight')}>
                <Icon
                  as={Check}
                  className={
                    fitnessGoal === 'maintain_weight'
                      ? 'text-primary-foreground'
                      : 'text-secondary-foreground'
                  }
                />
                <Text>Maintain Weight</Text>
              </Button>
              <Button
                variant={fitnessGoal === 'gain_muscle' ? 'default' : 'secondary'}
                onPress={() => setFitnessGoal('gain_muscle')}>
                <Icon
                  as={BicepsFlexed}
                  className={
                    fitnessGoal === 'gain_muscle'
                      ? 'text-primary-foreground'
                      : 'text-secondary-foreground'
                  }
                />
                <Text>Gain Muscle</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Adjust Macros Button */}
          <Button variant="outline">
            <Icon as={Settings} />
            <Text>Adjust Macros</Text>
            <Icon as={ChevronDown} />
          </Button>

          {/* Macro Calculation Button */}
          <Button onPress={calculateNutritionPlan} disabled={!isFormComplete}>
            <Text>Calculate My Macros</Text>
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <Card>
              <CardContent className="flex flex-row p-4">
                <CardDescription className="text-red-500">{errorMessage}</CardDescription>
              </CardContent>
            </Card>
          )}

          {/* Results Card */}
          {nutritionPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Your Nutrition Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Card className="bg-green-200">
                  <CardContent className="flex flex-row items-center justify-between">
                    <Text className="w-48 text-black">Total Daily Energy Expenditure</Text>
                    <Text className="h-min w-min text-2xl font-bold color-green-600">
                      {nutritionPlan.tdee} kcal
                    </Text>
                  </CardContent>
                </Card>
                <Card className="bg-blue-200">
                  <CardContent className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <View className="h-4 w-4 rounded-full bg-blue-600"></View>
                      <Text className="w-48 text-black">Protein</Text>
                    </View>
                    <Text className="h-min w-min text-xl font-bold color-blue-600">
                      {nutritionPlan.protein}g
                    </Text>
                  </CardContent>
                </Card>
                <Card className="bg-orange-200">
                  <CardContent className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <View className="h-4 w-4 rounded-full bg-orange-600"></View>
                      <Text className="w-48 text-black">Carbohydrates</Text>
                    </View>
                    <Text className="h-min w-min text-xl font-bold color-orange-600">
                      {nutritionPlan.carbs}g
                    </Text>
                  </CardContent>
                </Card>
                <Card className="bg-red-200">
                  <CardContent className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <View className="h-4 w-4 rounded-full bg-red-600"></View>
                      <Text className="w-48 text-black">Fat</Text>
                    </View>
                    <Text className="h-min w-min text-xl font-bold color-red-600">
                      {nutritionPlan.fat}g
                    </Text>
                  </CardContent>
                </Card>
                <Text>Macro Distribution</Text>
                <Card className={`p-2 ${colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
                  <CardContent className="p-0">
                    <View className="mx-auto flex h-24 w-full max-w-md flex-row overflow-hidden rounded-lg">
                      <View
                        className={`flex flex-col items-center justify-center bg-blue-600 text-center`}
                        style={{ width: `${macroDistribution.protein}%` }}>
                        <Text className="font-bold color-white">Protein</Text>
                        <Text className="color-white">{macroDistribution.protein}%</Text>
                      </View>
                      <View
                        className={`flex flex-col items-center justify-center bg-orange-600 text-center`}
                        style={{ width: `${macroDistribution.carbs}%` }}>
                        <Text className="font-bold color-white">Carbs</Text>
                        <Text className="color-white">{macroDistribution.carbs}%</Text>
                      </View>
                      <View
                        className={`flex flex-col items-center justify-center bg-red-600 text-center`}
                        style={{ width: `${macroDistribution.fat}%` }}>
                        <Text className="font-bold color-white">Fat</Text>
                        <Text className="color-white">{macroDistribution.fat}%</Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {/* Informational Card */}
          <Card>
            <CardHeader className="flex-row">
              <Icon as={Activity} size={24} />
              <CardTitle>How it Works</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Text>
                TDEE (Total Daily Energy Expenditure) represents the calories you burn per day
                including exercise. Our calculator uses the Mifflin-St Jeor equation to determine
                your Basal Metabolic Rate (BMR) and adjusts for your activity level and goals.
              </Text>
              <Text>Macronutrient recommendations are based on current nutrition science:</Text>
              <View className="pl-4">
                <Text>• Protein: 2.2g per kg of body weight</Text>
                <Text>• Fat: 25% of total calories</Text>
                <Text>• Carbohydrates: Remaining calories</Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
