/* eslint-disable @typescript-eslint/no-empty-object-type */
declare interface ClassDecoratorContext { }
declare interface ClassMethodDecoratorContext { }
declare interface ClassGetterDecoratorContext { }
declare interface ClassSetterDecoratorContext { }
declare interface ClassFieldDecoratorContext { }
declare interface ClassAccessorDecoratorContext { }

declare namespace os {
    function time(): number;
    function clock(): number;
    function date(fmt?: string, time?: number): string | { year: number; month: number; day: number; hour: number; min: number; sec: number; wday: number; yday: number; isdst: boolean; };
    function difftime(t2: number, t1: number): number;
}
