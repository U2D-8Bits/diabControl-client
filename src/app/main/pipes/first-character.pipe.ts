import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'firstCharacter'
})

export class FirstCharacterPipe implements PipeTransform {
    transform(value: string | null): string {
        if (!value) return '';
        return value.charAt(0);
    }
}