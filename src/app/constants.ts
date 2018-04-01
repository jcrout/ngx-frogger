export class Constants {
    static EntityClasses = class {
        static Frogger = "entity-frogger";
        static Car1 = "entity-car1";
        static Car2 = "entity-car2";
    }
    static EntityIds = class {
        static Frogger = 1;
        static Car1 = 2;
        static Car2 = 3;
        static Car3 = 4;
        static Car4 = 5;
        static Car5 = 6;
        static Snake = 7;
        static Turtle = 8;
        static PoisonFrog = 9;
        static Log = 10;
        static Alligator = 11;
        static Butterfly = 12;
        static GoalAlligator = 13;
    };
    static RowClasses = class {
        static Path = "row-path";
        static Road = "row-road";
        static Water = "row-water";
        static Goal = "row-goal";
    };
    static RowTileClasses = class {
        static Path = "tile-path";        
        static Road = "tile-road";
        static Water = "tile-water";
        static Goal = "tile-goal";
    };
    static TileIds = class {
        static Path = 1;
        static Road = 2;
        static Water = 3;
        static Goal = 4;
    };
}