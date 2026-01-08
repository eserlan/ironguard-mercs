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
    function date(fmt?: string, time?: number): any;
    function difftime(t2: number, t1: number): number;
}
