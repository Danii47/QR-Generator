def binary_modulo(dividend_bin, divisor_bin):

    """Perform binary polynomial division and return remainder."""

    # Convert to integer

    dividend = int(dividend_bin, 2)

    divisor = int(divisor_bin, 2)



    # Get bit lengths

    dividend_len = len(dividend_bin)

    divisor_len = len(divisor_bin)



    # Perform polynomial division

    while dividend.bit_length() >= divisor_len:

        shift = dividend.bit_length() - divisor_len

        dividend ^= (divisor << shift)  # XOR with shifted divisor



    # Convert remainder to binary and pad with zeros if necessary

    remainder_bin = bin(dividend)[2:].zfill(divisor_len - 1)

    return remainder_bin



# Definir valores en binario

format_bits = "111000000000000"  # 5 bits de formato + 10 ceros

generator_polynomial = "10100110111"  # Polinomio generador de BCH



# Calcular el código BCH

bch_result = binary_modulo(format_bits, generator_polynomial)

print(bch_result)