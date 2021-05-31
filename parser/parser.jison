/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return 'MULTIPLY'
"/"                   return 'DIVIDE'
"-"                   return 'SUBTRACT'
"+"                   return 'ADD'
"("                   return '('
")"                   return ')'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left 'ADD' 'SUBTRACT'
%left 'MULTIPLY' 'DIVIDE'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

e
    : e 'ADD' e
        {$$ = `{"operator": "multiply", "values": [${$1}, ${$3}]}`; }
    | e 'SUBTRACT' e
        {$$ = `{"operator": "subtract", "values": [${$1}, ${$3}]}`; }
    | e 'MULTIPLY' e
        {$$ = `{"operator": "multiply", "values": [${$1}, ${$3}]}`; }
    | e 'DIVIDE' e
        {$$ = `{"operator": "divide", "values": [${$1}, ${$3}]}`; }
    | 'SUBTRACT' e %prec UMINUS
        {$$ = -$2; }
    | '(' e ')'
        {$$ = $2; }
    | NUMBER
        {$$ = `{"expression": ${Number(yytext)} }`; }
    ;
