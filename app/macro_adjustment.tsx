import { Stack } from 'expo-router';
import { Text, View, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { useMacroDistribution } from '@/store/useMacroDistribution';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import FitnessGoalsCard from '@/components/FitnessGoalsCard';
import { useEffect, useState } from 'react';

const SCREEN_OPTIONS = {
  light: {
    title: 'Adjust Macros',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.light.background },
  },
  dark: {
    title: 'Adjust Macros',
    headerTransparent: false,
    headerShadowVisible: true,
    headerStyle: { backgroundColor: THEME.dark.background },
  },
};

type FitnessGoal = 'lose_weight' | 'maintain_weight' | 'gain_muscle' | undefined;

export default function MacroAdjustment() {
  const { colorScheme } = useColorScheme();

  const { protein, carbs, fat, setMacroDistribution } = useMacroDistribution();

  // Helper function to calculate calories from percentage
  const calculateCalories = (percentage: number, isFat: boolean = false) => {
    const calories = (percentage / 100) * 2000;
    return isFat ? Math.round(calories * (9 / 4)) : Math.round(calories * (4 / 4));
  };

  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(undefined);

  useEffect(() => {
    if (fitnessGoal) {
      if (fitnessGoal === 'lose_weight') {
        setMacroDistribution({ protein: 40, carbs: 30, fat: 30 });
      } else if (fitnessGoal === 'maintain_weight') {
        setMacroDistribution({ protein: 25, carbs: 45, fat: 30 });
      } else if (fitnessGoal === 'gain_muscle') {
        setMacroDistribution({ protein: 40, carbs: 40, fat: 20 });
      }
    }
  }, [fitnessGoal]);

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <ScrollView>
        <View className="flex flex-col gap-4 p-4">
          <FitnessGoalsCard
            cardTitle="Fitness Goal Based Macro Presets"
            fitnessGoal={fitnessGoal}
            setFitnessGoal={setFitnessGoal}
          />
          <Card>
            <CardHeader>
              <CardTitle>Adjust Macros</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex flex-col gap-4">
                <View className="flex flex-col gap-2">
                  <View className="flex flex-row justify-between">
                    <Text className="color-primary">Protein</Text>
                    <Text className="font-bold color-blue-600">{protein}%</Text>
                  </View>
                  <Progress value={protein} className="h-3" indicatorClassName="bg-blue-600" />
                  <View className="flex flex-row justify-between">
                    <Button
                      variant="outline"
                      onPress={() => setMacroDistribution({ protein: protein - 5 })}>
                      <Text className="color-primary">-5%</Text>
                    </Button>
                    <Button
                      variant="outline"
                      onPress={() => setMacroDistribution({ protein: protein + 5 })}>
                      <Text className="color-primary">+5%</Text>
                    </Button>
                  </View>
                </View>
                <View className="flex flex-col gap-2">
                  <View className="flex flex-row justify-between">
                    <Text className="color-primary">Carbs</Text>
                    <Text className="font-bold color-orange-600">{carbs}%</Text>
                  </View>
                  <Progress value={carbs} className="h-3" indicatorClassName="bg-orange-600" />
                  <View className="flex flex-row justify-between">
                    <Button
                      variant="outline"
                      onPress={() => setMacroDistribution({ carbs: carbs - 5 })}>
                      <Text className="color-primary">-5%</Text>
                    </Button>
                    <Button
                      variant="outline"
                      onPress={() => setMacroDistribution({ carbs: carbs + 5 })}>
                      <Text className="color-primary">+5%</Text>
                    </Button>
                  </View>
                </View>
                <View className="flex flex-col gap-2">
                  <View className="flex flex-row justify-between">
                    <Text className="color-primary">Fat</Text>
                    <Text className="font-bold color-red-600">{fat}%</Text>
                  </View>
                  <Progress value={fat} className="h-3" indicatorClassName="bg-red-600" />
                  <View className="flex flex-row justify-between">
                    <Button
                      variant="outline"
                      onPress={() => setMacroDistribution({ fat: fat - 5 })}>
                      <Text className="color-primary">-5%</Text>
                    </Button>
                    <Button
                      variant="outline"
                      onPress={() => setMacroDistribution({ fat: fat + 5 })}>
                      <Text className="color-primary">+5%</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
