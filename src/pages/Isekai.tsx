import {
  Coins,
  Gem,
  HeartPulse,
  Minus,
  Plus,
  RotateCcw,
  ScrollText,
  Skull,
  Sparkles,
  Sword,
  Trash2,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import backgroundImage from "../assets/background2.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Navbar from "../components/Navbar";

type HeroStatus = {
  maxHealth: number;
  currentHealth: number;
  attackPoint: number;
  karma: number;
  gold: number;
  soulStone: number;
  notes: string;
};

type MonsterStatus = {
  id: string;
  maxHealth: number;
  currentHealth: number;
  attackPoint: number;
  rewards: string;
  notes: string;
};

type SavedIsekaiStatus = {
  hero?: Partial<HeroStatus>;
  monster?: Partial<MonsterStatus>;
  monsters?: Partial<MonsterStatus>[];
};

type IsekaiStatus = {
  hero: HeroStatus;
  monsters: MonsterStatus[];
};

const STORAGE_KEY = "egghub:isekai-status";

const defaultHero: HeroStatus = {
  maxHealth: 20,
  currentHealth: 20,
  attackPoint: 1,
  karma: 0,
  gold: 0,
  soulStone: 0,
  notes: "",
};

const createMonster = (id: string = crypto.randomUUID()): MonsterStatus => ({
  id,
  maxHealth: 10,
  currentHealth: 10,
  attackPoint: 1,
  rewards: "",
  notes: "",
});

const createDefaultStatus = (): IsekaiStatus => ({
  hero: defaultHero,
  monsters: [createMonster("monster-1")],
});

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const toNumber = (value: string) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const normalizeMonster = (
  monster: Partial<MonsterStatus> | undefined,
  index: number,
): MonsterStatus => {
  const nextMonster = {
    ...createMonster(`monster-${index + 1}`),
    ...monster,
  };

  return {
    ...nextMonster,
    attackPoint: clamp(nextMonster.attackPoint, 0, 5),
    currentHealth: clamp(nextMonster.currentHealth, 0, nextMonster.maxHealth),
  };
};

const loadSavedStatus = (): IsekaiStatus => {
  const savedStatus = window.localStorage.getItem(STORAGE_KEY);

  if (!savedStatus) {
    return createDefaultStatus();
  }

  try {
    const parsedStatus = JSON.parse(savedStatus) as SavedIsekaiStatus;
    const savedMonsters =
      parsedStatus.monsters && parsedStatus.monsters.length > 0
        ? parsedStatus.monsters
        : [parsedStatus.monster];

    return {
      hero: {
        ...defaultHero,
        ...parsedStatus.hero,
      },
      monsters: savedMonsters.map(normalizeMonster),
    };
  } catch {
    return createDefaultStatus();
  }
};

const getHealthPercent = (currentHealth: number, maxHealth: number) => {
  if (maxHealth <= 0) {
    return 0;
  }

  return clamp((currentHealth / maxHealth) * 100, 0, 100);
};

const Isekai = () => {
  const [status, setStatus] = useState<IsekaiStatus>(loadSavedStatus);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  }, [status]);

  const heroHealthPercent = useMemo(
    () => getHealthPercent(status.hero.currentHealth, status.hero.maxHealth),
    [status.hero.currentHealth, status.hero.maxHealth],
  );

  const updateHeroNumber = (
    field: keyof Omit<HeroStatus, "notes">,
    value: string,
  ) => {
    setStatus((currentStatus) => {
      const nextHero = {
        ...currentStatus.hero,
        [field]:
          field === "attackPoint"
            ? clamp(toNumber(value), 0, 5)
            : Math.max(0, toNumber(value)),
      };

      if (field === "maxHealth") {
        nextHero.currentHealth = clamp(
          nextHero.currentHealth,
          0,
          nextHero.maxHealth,
        );
      }

      if (field === "currentHealth") {
        nextHero.currentHealth = clamp(
          toNumber(value),
          0,
          nextHero.maxHealth,
        );
      }

      return {
        ...currentStatus,
        hero: nextHero,
      };
    });
  };

  const updateMonster = (
    monsterId: string,
    updater: (monster: MonsterStatus) => MonsterStatus,
  ) => {
    setStatus((currentStatus) => ({
      ...currentStatus,
      monsters: currentStatus.monsters.map((monster) =>
        monster.id === monsterId ? updater(monster) : monster,
      ),
    }));
  };

  const updateMonsterNumber = (
    monsterId: string,
    field: keyof Omit<MonsterStatus, "id" | "rewards" | "notes">,
    value: string,
  ) => {
    updateMonster(monsterId, (monster) => {
      const nextMonster = {
        ...monster,
        [field]:
          field === "attackPoint"
            ? clamp(toNumber(value), 0, 5)
            : Math.max(0, toNumber(value)),
      };

      if (field === "maxHealth") {
        nextMonster.currentHealth = clamp(
          nextMonster.currentHealth,
          0,
          nextMonster.maxHealth,
        );
      }

      if (field === "currentHealth") {
        nextMonster.currentHealth = clamp(
          toNumber(value),
          0,
          nextMonster.maxHealth,
        );
      }

      return nextMonster;
    });
  };

  const adjustHeroHealth = (amount: number) => {
    setStatus((currentStatus) => ({
      ...currentStatus,
      hero: {
        ...currentStatus.hero,
        currentHealth: clamp(
          currentStatus.hero.currentHealth + amount,
          0,
          currentStatus.hero.maxHealth,
        ),
      },
    }));
  };

  const adjustMonsterHealth = (monsterId: string, amount: number) => {
    updateMonster(monsterId, (monster) => ({
      ...monster,
      currentHealth: clamp(
        monster.currentHealth + amount,
        0,
        monster.maxHealth,
      ),
    }));
  };

  const refillHeroHealth = () => {
    setStatus((currentStatus) => ({
      ...currentStatus,
      hero: {
        ...currentStatus.hero,
        currentHealth: currentStatus.hero.maxHealth,
      },
    }));
  };

  const refillMonsterHealth = (monsterId: string) => {
    updateMonster(monsterId, (monster) => ({
      ...monster,
      currentHealth: monster.maxHealth,
    }));
  };

  const resetHero = () => {
    setStatus((currentStatus) => ({
      ...currentStatus,
      hero: defaultHero,
    }));
  };

  const resetMonster = (monsterId: string) => {
    updateMonster(monsterId, (monster) => createMonster(monster.id));
  };

  const addMonster = () => {
    setStatus((currentStatus) => ({
      ...currentStatus,
      monsters: [...currentStatus.monsters, createMonster()],
    }));
  };

  const removeMonster = (monsterId: string) => {
    setStatus((currentStatus) => {
      if (currentStatus.monsters.length === 1) {
        return {
          ...currentStatus,
          monsters: [createMonster(currentStatus.monsters[0].id)],
        };
      }

      return {
        ...currentStatus,
        monsters: currentStatus.monsters.filter(
          (monster) => monster.id !== monsterId,
        ),
      };
    });
  };

  const resetAll = () => {
    setStatus(createDefaultStatus());
  };

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-white/80 bg-white/92 p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Board Game Helper
            </p>
            <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl">
              Isekai Status Cards
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={resetAll}
            className="border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
          >
            <RotateCcw />
            Reset All
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <section className="rounded-lg border border-emerald-100 bg-white/94 p-4 shadow-lg sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <UserRound size={22} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-950">
                    Hero Status Card
                  </h2>
                  <p className="text-sm text-gray-600">
                    Track health, combat stats, currency, and table notes.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={resetHero}
                title="Reset hero"
                className="text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <RotateCcw />
              </Button>
            </div>

            <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <HeartPulse size={18} />
                  Health
                </div>
                <div className="text-sm font-bold text-emerald-900">
                  {status.hero.currentHealth} / {status.hero.maxHealth}
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${heroHealthPercent}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => adjustHeroHealth(-1)}
                  className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-100"
                >
                  <Minus />
                  1
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => adjustHeroHealth(1)}
                  className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-100"
                >
                  <Plus />
                  1
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={refillHeroHealth}
                  className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-100"
                >
                  <Sparkles />
                  Full
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                icon={<HeartPulse size={17} />}
                label="Max Health"
                value={status.hero.maxHealth}
                onChange={(value) => updateHeroNumber("maxHealth", value)}
              />
              <NumberField
                icon={<HeartPulse size={17} />}
                label="Current Health"
                value={status.hero.currentHealth}
                onChange={(value) => updateHeroNumber("currentHealth", value)}
              />
              <NumberField
                icon={<Sword size={17} />}
                label="Attack Point"
                max={5}
                value={status.hero.attackPoint}
                onChange={(value) => updateHeroNumber("attackPoint", value)}
              />
              <NumberField
                icon={<Sparkles size={17} />}
                label="Karma"
                value={status.hero.karma}
                onChange={(value) => updateHeroNumber("karma", value)}
              />
              <NumberField
                icon={<Coins size={17} />}
                label="Gold"
                value={status.hero.gold}
                onChange={(value) => updateHeroNumber("gold", value)}
              />
              <NumberField
                icon={<Gem size={17} />}
                label="SoulStone"
                value={status.hero.soulStone}
                onChange={(value) => updateHeroNumber("soulStone", value)}
              />
            </div>

            <TextAreaField
              icon={<ScrollText size={17} />}
              label="Notes"
              value={status.hero.notes}
              onChange={(value) =>
                setStatus((currentStatus) => ({
                  ...currentStatus,
                  hero: {
                    ...currentStatus.hero,
                    notes: value,
                  },
                }))
              }
            />
          </section>

          <section className="rounded-lg border border-red-100 bg-white/94 p-4 shadow-lg sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
                  <Skull size={22} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-gray-950">
                    Monster Status Cards
                  </h2>
                  <p className="text-sm text-gray-600">
                    Keep every enemy health, attack, rewards, and notes visible.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addMonster}
                className="border-red-200 bg-white text-red-700 hover:bg-red-50"
              >
                <Plus />
                Add Monster
              </Button>
            </div>

            <div className="space-y-4">
              {status.monsters.map((monster, index) => (
                <MonsterCard
                  key={monster.id}
                  monster={monster}
                  monsterNumber={index + 1}
                  canRemove={status.monsters.length > 1}
                  onAdjustHealth={(amount) =>
                    adjustMonsterHealth(monster.id, amount)
                  }
                  onRefillHealth={() => refillMonsterHealth(monster.id)}
                  onReset={() => resetMonster(monster.id)}
                  onRemove={() => removeMonster(monster.id)}
                  onNumberChange={(field, value) =>
                    updateMonsterNumber(monster.id, field, value)
                  }
                  onTextChange={(field, value) =>
                    updateMonster(monster.id, (currentMonster) => ({
                      ...currentMonster,
                      [field]: value,
                    }))
                  }
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

type MonsterCardProps = {
  monster: MonsterStatus;
  monsterNumber: number;
  canRemove: boolean;
  onAdjustHealth: (amount: number) => void;
  onRefillHealth: () => void;
  onReset: () => void;
  onRemove: () => void;
  onNumberChange: (
    field: keyof Omit<MonsterStatus, "id" | "rewards" | "notes">,
    value: string,
  ) => void;
  onTextChange: (field: "rewards" | "notes", value: string) => void;
};

const MonsterCard = ({
  monster,
  monsterNumber,
  canRemove,
  onAdjustHealth,
  onRefillHealth,
  onReset,
  onRemove,
  onNumberChange,
  onTextChange,
}: MonsterCardProps) => {
  const monsterHealthPercent = getHealthPercent(
    monster.currentHealth,
    monster.maxHealth,
  );

  return (
    <article className="rounded-lg border border-red-100 bg-white/80 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-950">
          Monster {monsterNumber}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onReset}
            title={`Reset monster ${monsterNumber}`}
            className="text-gray-500 hover:bg-red-50 hover:text-red-700"
          >
            <RotateCcw />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            title={
              canRemove
                ? `Remove monster ${monsterNumber}`
                : `Clear monster ${monsterNumber}`
            }
            className="text-gray-500 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-red-100 bg-red-50/70 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-800">
            <HeartPulse size={18} />
            Health
          </div>
          <div className="text-sm font-bold text-red-900">
            {monster.currentHealth} / {monster.maxHealth}
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-red-500 transition-all"
            style={{ width: `${monsterHealthPercent}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onAdjustHealth(-1)}
            className="border-red-200 bg-white text-red-800 hover:bg-red-100"
          >
            <Minus />
            1
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onAdjustHealth(1)}
            className="border-red-200 bg-white text-red-800 hover:bg-red-100"
          >
            <Plus />
            1
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onRefillHealth}
            className="border-red-200 bg-white text-red-800 hover:bg-red-100"
          >
            <Sparkles />
            Full
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          icon={<HeartPulse size={17} />}
          label="Max Health"
          value={monster.maxHealth}
          onChange={(value) => onNumberChange("maxHealth", value)}
        />
        <NumberField
          icon={<HeartPulse size={17} />}
          label="Current Health"
          value={monster.currentHealth}
          onChange={(value) => onNumberChange("currentHealth", value)}
        />
        <NumberField
          icon={<Sword size={17} />}
          label="Attack Point"
          max={5}
          value={monster.attackPoint}
          onChange={(value) => onNumberChange("attackPoint", value)}
        />
      </div>

      <TextAreaField
        icon={<Coins size={17} />}
        label="Rewards"
        value={monster.rewards}
        onChange={(value) => onTextChange("rewards", value)}
      />
      <TextAreaField
        icon={<ScrollText size={17} />}
        label="Notes"
        value={monster.notes}
        onChange={(value) => onTextChange("notes", value)}
      />
    </article>
  );
};

type NumberFieldProps = {
  icon: ReactNode;
  label: string;
  max?: number;
  value: number;
  onChange: (value: string) => void;
};

const NumberField = ({
  icon,
  label,
  max,
  value,
  onChange,
}: NumberFieldProps) => (
  <label className="block">
    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
      {icon}
      {label}
      {max !== undefined && (
        <span className="text-xs font-medium text-gray-500">Max {max}</span>
      )}
    </span>
    <Input
      type="number"
      min={0}
      max={max}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="border-gray-300 bg-white focus-visible:border-orange-500 focus-visible:ring-orange-200"
    />
  </label>
);

type TextAreaFieldProps = {
  icon: ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const TextAreaField = ({
  icon,
  label,
  value,
  onChange,
}: TextAreaFieldProps) => (
  <label className="mt-4 block">
    <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
      {icon}
      {label}
    </span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={5}
      className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-gray-400 focus:border-orange-500 focus:ring-3 focus:ring-orange-200"
      placeholder="Type anything you would usually write on the card."
    />
  </label>
);

export default Isekai;
