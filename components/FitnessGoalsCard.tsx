import { useFitnessGoal } from '@/store/useFitnessGoal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChartColumnDecreasing, Check, BicepsFlexed } from 'lucide-react-native';
import { FitnessGoal } from '@/store/useFitnessGoal';

type FitnessGoalsCardProps = {
  cardTitle?: string;
  fitnessGoal: FitnessGoal;
  setFitnessGoal: (fitnessGoal: FitnessGoal) => void;
};

export default function FitnessGoalsCard({
  cardTitle = 'Fitness Goal',
  fitnessGoal,
  setFitnessGoal,
}: FitnessGoalsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
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
  );
}
