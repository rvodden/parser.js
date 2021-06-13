/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
\-?[0-9]+("."[0-9]+)?\b   return 'NUMBER'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

/* operator associations and precedence */

%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : exp EOF
        { return $1; }
    ;
exp
    : NUMBER
        {$$ = new Expression(Number(yytext)); }
    ;
%%
const Expression = require('model').Expression
