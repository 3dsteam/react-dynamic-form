# React Dynamic Form

A React library for creating dynamic forms based on JSON schema.

## Visualizzazione tramite condizione

Tramite il campo `conditions` presente a livello di *field* è possibile specificare le condizioni
che devono essere soddisfatte affinché l'input venga visualizzato.

Le condizioni possono essere in `and` oppure in `or`.

#### ICondition

| Parameter   | Type               | Description                                                                  |
|:------------|:-------------------|:-----------------------------------------------------------------------------|
| `condition` | `"and" \| "or"`    | Indica se le condizioni devono verificarsi tutte (`and`) o almeno una (`or`) |
| `rules`     | `IConditionRule[]` | Array di regole                                                              |

#### IConditionRule

| Parameter  | Type                       | Description                             |
|:-----------|:---------------------------|:----------------------------------------|
| `field`    | `string`                   | Identificativo del campo da controllare |
| `operator` | `EConditionRuleOperator`   | Operatore                               |
| `value`    | `unknown`                  | Valore da confrontare                   |

#### EConditionRuleOperator
```typescript
enum EConditionRuleOperator {
    EQUAL = "equal",
    NOT_EQUAL = "notequal",
    IS_NULL = "isnull",
    IS_NOT_NULL = "isnotnull",
    IS_EMPTY = "isempty",
    IS_NOT_EMPTY = "isnotempty",
}
```

### Valore dinamico `{{field}}`

Il valore di `value` può essere un valore statico oppure un valore dinamico.

Per poter leggere il valore di un'altra proprietà è possibile utilizzare la sintassi `{{field}}`, 
dove `field` è l'identificativo del campo da cui leggere il valore.

### Esempio

Supponiamo di voler visualizzare il campo privacy solo se:
- il campo email è valorizzato
- il campo password è valorizzato
- il campo password è uguale al campo conferma password

```typescript jsx
import {DynamicForm, EFieldType, EConditionRuleOperator} from "@3dsteam/react-dynamic-form";

<DynamicForm
    fields={[
        {
            name: "email",
            placeholder: "Email",
            type: EFieldType.EMAIL,
        },
        {
            name: "password",
            placeholder: "Password",
            type: EFieldType.PASSWORD,
        },
        {
            name: "confirm",
            placeholder: "Conferma password",
            type: EFieldType.PASSWORD,
        },
        {
            name: "privacy",
            label: "Accetto la privacy",
            type: EFieldType.CHECKBOX,
            // View conditions
            conditions: {
                condition: "and",
                rules: [
                    {
                        field: "email",
                        operator: EConditionRuleOperator.IS_NOT_EMPTY,
                        value: null,
                    },
                    {
                        field: "password",
                        operator: EConditionRuleOperator.IS_NOT_EMPTY,
                        value: null,
                    },
                    {
                        field: "password",
                        operator: EConditionRuleOperator.EQUAL,
                        value: "{{confirm}}",
                    },
                ]
            }
        }
    ]}
/>
```

