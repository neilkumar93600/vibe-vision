type Genre = {
    value: string;
    icon: string;
    theme: string;
    description: string;
  };
  
  type StorySettings = {
    tone: string;
    ageGroup: string;
    pacing: string;
    duration: number
    complexity: string;
  };
  
  type GeneratedStory = {
    id: string;
    title: string;
    content: string;
    genre: string;
    prompt: string;
    settings: StorySettings;
    createdAt: string;
    likes: number;
  };
  
  interface StoryHistoryItem extends GeneratedStory {
    summary: string;
    characters: string[];
  }